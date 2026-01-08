// Vercel serverless function - Main API handler
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware - CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Simple health check
app.get('/api/health', async (req, res) => {
  try {
    await initializeDatabase();
    const { mongoose } = require('../backend/config/database');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({ 
      status: 'OK', 
      message: 'Lion Car Sale API is running',
      api: 'REST API',
      database: 'MongoDB',
      dbStatus: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({ 
      status: 'WARNING', 
      message: 'Lion Car Sale API is running but database connection failed',
      api: 'REST API',
      database: 'MongoDB',
      dbStatus: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Lion Car Sale API Server (REST API)',
    endpoints: {
      vehicles: `${req.protocol}://${req.get('host')}/api/vehicles`,
      vehicle: `${req.protocol}://${req.get('host')}/api/vehicles/:id`,
      makes: `${req.protocol}://${req.get('host')}/api/vehicles/filters/makes`,
      years: `${req.protocol}://${req.get('host')}/api/vehicles/filters/years`,
      upload: `${req.protocol}://${req.get('host')}/api/upload/single`,
      health: `${req.protocol}://${req.get('host')}/api/health`
    }
  });
});

// Database initialization (lazy loaded)
let dbInitialized = false;
let dbInitializationPromise = null;

async function initializeDatabase() {
  // If already initialized, return
  if (dbInitialized) {
    return;
  }

  // If initialization in progress, wait
  if (dbInitializationPromise) {
    return dbInitializationPromise;
  }

  // Start initialization
  dbInitializationPromise = (async () => {
    try {
      console.log('🔌 Initializing database connection...');

      // Import dependencies (lazy load)
      const { initializeDatabase: initDB, mongoose } = require('../backend/config/database');

      // Connect to database
      try {
        if (mongoose.connection.readyState !== 1) {
          console.log('⏳ Connecting to MongoDB...');
          await initDB();
          
          // Verify connection is ready
          if (mongoose.connection.readyState !== 1) {
            throw new Error('Database connection not ready after initialization');
          }
          
          console.log('✅ MongoDB database ready');
          console.log('Connection state:', mongoose.connection.readyState);
        } else {
          console.log('✅ MongoDB already connected');
        }
        
        dbInitialized = true;
      } catch (dbError) {
        console.error('❌ Database connection failed:', dbError.message);
        console.error('Stack:', dbError.stack);
        dbInitialized = false;
        // In serverless, allow graceful degradation - routes will handle errors
        console.error('⚠️  Continuing without database - routes will handle errors');
      }
    } catch (err) {
      console.error('❌ Database initialization error:', err.message);
      console.error('Stack:', err.stack);
      dbInitializationPromise = null;
      dbInitialized = false;
    }
  })();

  return dbInitializationPromise;
}

// REST API Routes - Direct MongoDB connection
// Load vehicles router once (not on every request)
let vehiclesRouter = null;

function getVehiclesRouter() {
  if (!vehiclesRouter) {
    vehiclesRouter = require('../backend/routes/vehicles');
  }
  return vehiclesRouter;
}

app.use('/api/vehicles', async (req, res, next) => {
  try {
    // Initialize database if needed
    await initializeDatabase();
    // Use vehicles router
    const router = getVehiclesRouter();
    return router(req, res, next);
  } catch (error) {
    console.error('Vehicles route error:', error);
    console.error('Stack:', error.stack);
    if (!res.headersSent) {
      res.status(500).json({
        status: 'ERROR',
        message: 'Vehicles service not available',
        error: error.message
      });
    }
  }
});

// File upload routes (lazy load)
app.use('/api/upload', async (req, res, next) => {
  try {
    await initializeDatabase();
    const uploadRouter = require('../backend/routes/upload');
    return uploadRouter(req, res, next);
  } catch (error) {
    console.error('Upload route error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        status: 'ERROR',
        message: 'Upload service not available',
        error: error.message
      });
    }
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../backend/uploads')));

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Express error:', err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      status: 'ERROR',
      message: err.message || 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Initialize database connection (lazy, only once)
    await initializeDatabase();
    
    // Handle the request with Express
    return app(req, res);
  } catch (error) {
    console.error('❌ Serverless function error:', error);
    console.error('Stack:', error.stack);
    
    // Return error response
    if (!res.headersSent) {
      res.status(500).json({
        status: 'ERROR',
        message: 'Server error occurred',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};
