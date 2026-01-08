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

// Diagnostic endpoint to identify where errors occur
app.get('/api/diagnostic', async (req, res) => {
  const diagnostic = {
    step1_frontend_to_backend: {
      status: 'OK',
      message: 'Backend received request successfully',
      timestamp: new Date().toISOString()
    },
    step2_backend_status: {
      status: 'OK',
      message: 'Backend is running',
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'not set'
    },
    step3_database_connection: {
      status: 'CHECKING',
      message: 'Testing database connection...'
    },
    step4_database_query: {
      status: 'PENDING',
      message: 'Waiting for connection test...'
    }
  };

  try {
    // Step 3: Test Database Connection
    try {
      const { mongoose, connectDatabase } = require('../backend/config/database');
      
      diagnostic.step3_database_connection.connectionState = mongoose.connection.readyState;
      diagnostic.step3_database_connection.connectionStateText = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }[mongoose.connection.readyState] || 'unknown';

      if (mongoose.connection.readyState !== 1) {
        console.log('🔌 Attempting to connect to database...');
        await connectDatabase();
        
        // Wait a moment for connection to establish
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (mongoose.connection.readyState === 1) {
        // Test ping
        await mongoose.connection.db.admin().ping();
        
        diagnostic.step3_database_connection.status = 'OK';
        diagnostic.step3_database_connection.message = 'Database connection successful';
        diagnostic.step3_database_connection.databaseName = mongoose.connection.db.databaseName;
        diagnostic.step3_database_connection.host = mongoose.connection.host;
        
        // Step 4: Test Database Query
        try {
          const Vehicle = require('../backend/models/Vehicle');
          const count = await Vehicle.countDocuments({});
          
          diagnostic.step4_database_query.status = 'OK';
          diagnostic.step4_database_query.message = 'Database query successful';
          diagnostic.step4_database_query.vehicleCount = count;
          diagnostic.step4_database_query.collectionName = 'vehicles';
        } catch (queryError) {
          diagnostic.step4_database_query.status = 'ERROR';
          diagnostic.step4_database_query.message = 'Database query failed';
          diagnostic.step4_database_query.error = queryError.message;
          diagnostic.step4_database_query.stack = queryError.stack;
        }
      } else {
        diagnostic.step3_database_connection.status = 'ERROR';
        diagnostic.step3_database_connection.message = 'Database connection failed';
        diagnostic.step3_database_connection.error = `Connection state: ${mongoose.connection.readyState}`;
      }
    } catch (dbError) {
      diagnostic.step3_database_connection.status = 'ERROR';
      diagnostic.step3_database_connection.message = 'Database connection error';
      diagnostic.step3_database_connection.error = dbError.message;
      diagnostic.step3_database_connection.stack = dbError.stack;
      
      // Check if DATABASE_URL is set
      if (!process.env.DATABASE_URL) {
        diagnostic.step3_database_connection.error = 'DATABASE_URL environment variable is not set';
      }
    }

    // Determine overall status
    const hasErrors = 
      diagnostic.step3_database_connection.status === 'ERROR' ||
      diagnostic.step4_database_query.status === 'ERROR';

    res.json({
      overall_status: hasErrors ? 'ERROR' : 'OK',
      summary: {
        frontend_to_backend: '✅ Working',
        backend_status: '✅ Working',
        database_connection: diagnostic.step3_database_connection.status === 'OK' ? '✅ Working' : '❌ Failed',
        database_query: diagnostic.step4_database_query.status === 'OK' ? '✅ Working' : '❌ Failed'
      },
      details: diagnostic,
      troubleshooting: {
        if_frontend_to_backend_fails: 'Check Vercel deployment and URL',
        if_backend_fails: 'Check Vercel logs and server configuration',
        if_database_connection_fails: 'Check DATABASE_URL in Vercel and MongoDB Atlas Network Access',
        if_database_query_fails: 'Check MongoDB user permissions and collection exists'
      }
    });
  } catch (error) {
    res.status(500).json({
      overall_status: 'ERROR',
      error: error.message,
      stack: error.stack,
      diagnostic: diagnostic
    });
  }
});

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
    
    // Verify database is connected
    const { mongoose } = require('../backend/config/database');
    if (mongoose.connection.readyState !== 1) {
      console.error('⚠️  Database not connected, readyState:', mongoose.connection.readyState);
      throw new Error('Database connection not established');
    }
    
    // Use vehicles router
    const router = getVehiclesRouter();
    return router(req, res, next);
  } catch (error) {
    console.error('❌ Vehicles route error:', error.message);
    console.error('Stack:', error.stack);
    if (!res.headersSent) {
      return res.status(500).json({
        status: 'ERROR',
        message: 'Vehicles service not available',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
