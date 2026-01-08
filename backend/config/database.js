const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection options - increased timeouts for serverless
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // Increased from 10s to 30s for serverless
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000, // Connection timeout
  maxPoolSize: 10,
  minPoolSize: 1,
  retryWrites: true,
  w: 'majority',
  // Disable buffering - fail immediately if not connected
  bufferCommands: false,
};

let isConnected = false;

// Get database URL from environment
function getDatabaseUrl() {
  let url = process.env.DATABASE_URL;
  
  if (!url) {
    return url;
  }
  
  // If URL doesn't have database name, add it
  // Check if database name is already in the path (after .net/)
  const urlParts = url.match(/^(mongodb\+srv:\/\/[^/]+\/[^?]*)/);
  const hasDatabase = urlParts && urlParts[1] && urlParts[1].split('/').length > 4;
  
  if (!hasDatabase) {
    // Extract query string if exists
    const queryMatch = url.match(/\?(.+)$/);
    const queryString = queryMatch ? '?' + queryMatch[1] : '';
    const baseUrl = url.replace(/\?.*$/, '').replace(/\/$/, '');
    
    // Add database name before query string
    url = `${baseUrl}/lion_car_sale${queryString}`;
  }
  
  return url;
}

// Connect to MongoDB
async function connectDatabase() {
  // If already connected, verify with ping and return
  if (mongoose.connection.readyState === 1) {
    try {
      // Quick ping to verify connection is still alive
      await mongoose.connection.db.admin().ping();
      isConnected = true;
      return;
    } catch (pingError) {
      // Connection exists but ping failed, reconnect
      console.log('⚠️  Connection ping failed, reconnecting...');
      mongoose.connection.readyState = 0; // Force reconnect
    }
  }

  // If already connecting, wait with increased timeout
  if (mongoose.connection.readyState === 2) {
    console.log('⏳ Waiting for existing connection attempt...');
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Database connection timeout - waited too long'));
      }, 35000); // 35 seconds timeout
      
      mongoose.connection.once('connected', () => {
        clearTimeout(timeout);
        isConnected = true;
        resolve();
      });
      
      mongoose.connection.once('error', (err) => {
        clearTimeout(timeout);
        isConnected = false;
        reject(err);
      });
    });
    
    // Verify connection with ping
    try {
      await mongoose.connection.db.admin().ping();
      isConnected = true;
      return;
    } catch (pingError) {
      throw new Error('Connection established but ping failed');
    }
  }

  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    console.log('🔌 Connecting to MongoDB...');
    console.log('Database URL:', databaseUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs
    
    // Connect with options
    await mongoose.connect(databaseUrl, mongooseOptions);
    
    // Wait for connection to be ready
    await new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
        return;
      }
      
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', reject);
      
      // Timeout after 30 seconds
      setTimeout(() => reject(new Error('Connection timeout after mongoose.connect')), 30000);
    });
    
    // Verify connection with ping
    await mongoose.connection.db.admin().ping();
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('Connection state:', mongoose.connection.readyState);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Error details:', error);
    isConnected = false;
    // Reset connection state on error
    mongoose.connection.readyState = 0;
    // In serverless, throw to prevent queries from running without connection
    throw error;
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
  isConnected = false;
});

// Initialize database
async function initializeDatabase() {
  try {
    await connectDatabase();
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    // In serverless, allow graceful degradation
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = {
  mongoose,
  connectDatabase,
  initializeDatabase
};
