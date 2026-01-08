const mongoose = require('mongoose');
const functions = require('firebase-functions');

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let isConnected = false;

// Get database URL from Firebase config or environment variable
function getDatabaseUrl() {
  // Try Firebase config first (for deployed functions)
  try {
    const config = functions.config();
    if (config.database && config.database.url) {
      return config.database.url;
    }
  } catch (e) {
    // Config not available (running locally or not set)
  }
  
  // Fall back to environment variable
  return process.env.DATABASE_URL;
}

// Connect to MongoDB
async function connectDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      throw new Error('DATABASE_URL or Firebase config database.url must be set');
    }

    // If already connecting, wait
    if (mongoose.connection.readyState === 2) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
      isConnected = true;
      return;
    }

    await mongoose.connect(databaseUrl, mongooseOptions);
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    isConnected = false;
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

module.exports = {
  mongoose,
  connectDatabase
};

