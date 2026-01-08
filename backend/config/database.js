const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
};

let isConnected = false;

// Get database URL from environment
function getDatabaseUrl() {
  return process.env.DATABASE_URL;
}

// Connect to MongoDB
async function connectDatabase() {
  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  // If already connecting, wait
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Database connection timeout'));
      }, 10000);
      
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
    return;
  }

  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    await mongoose.connect(databaseUrl, mongooseOptions);
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    isConnected = false;
    // In serverless, don't throw - allow retry on next request
    if (process.env.NODE_ENV === 'production') {
      console.error('⚠️  Connection failed, will retry on next request');
    } else {
      throw error;
    }
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
