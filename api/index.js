// Vercel serverless function - Main API handler
const express = require('express');
const cors = require('cors');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');

const { initializeDatabase, mongoose } = require('../backend/config/database');
const typeDefs = require('../backend/graphql/schema');
const resolvers = require('../backend/graphql/resolvers');

// Create Express app
const app = express();

// Middleware - CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../backend/uploads')));

// File upload routes
app.use('/api/upload', require('../backend/routes/upload'));

// Apollo Server instance
let apolloServer = null;
let serverInitialized = false;
let initializationPromise = null;

// Initialize Apollo Server and database
async function initializeServer() {
  // If already initialized, return
  if (serverInitialized && apolloServer) {
    return;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      console.log('🔌 Initializing server...');

      // Connect to database (non-blocking in serverless)
      if (mongoose.connection.readyState !== 1) {
        try {
          await initializeDatabase();
          console.log('✅ MongoDB database ready');
        } catch (dbError) {
          console.error('⚠️  Database connection failed:', dbError.message);
          // Continue without database - will retry on GraphQL queries
        }
      }

      // Create Apollo Server if not exists
      if (!apolloServer) {
        apolloServer = new ApolloServer({
          typeDefs,
          resolvers,
          introspection: true,
          playground: true,
          context: ({ req }) => {
            return { req };
          },
        });

        await apolloServer.start();
        apolloServer.applyMiddleware({ app, path: '/graphql' });
        
        console.log('✅ Apollo Server started');
      }
      
      serverInitialized = true;
      console.log('✅ Server initialization complete');
    } catch (err) {
      console.error('❌ Server initialization error:', err.message);
      console.error(err.stack);
      serverInitialized = false;
      initializationPromise = null;
      // Don't throw - allow graceful error handling
    }
  })();

  return initializationPromise;
}

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await initializeServer();
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({ 
      status: 'OK', 
      message: 'Lion Car Sale GraphQL API is running',
      database: 'MongoDB',
      databaseStatus: dbStatus,
      graphql: `${req.protocol}://${req.get('host')}/graphql`
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Server initialization failed',
      error: error.message
    });
  }
});

// Root route
app.get('/', async (req, res) => {
  try {
    await initializeServer();
    res.json({ 
      status: 'OK', 
      message: 'Lion Car Sale API Server',
      endpoints: {
        graphql: `${req.protocol}://${req.get('host')}/graphql`,
        health: `${req.protocol}://${req.get('host')}/api/health`
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Server initialization failed',
      error: error.message
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Express error:', err);
  res.status(err.status || 500).json({
    status: 'ERROR',
    message: err.message || 'Internal server error'
  });
});

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Initialize server if not already done
    await initializeServer();
    
    // Handle the request
    return app(req, res);
  } catch (error) {
    console.error('❌ Serverless function error:', error);
    console.error('Stack:', error.stack);
    
    // Return error response
    if (!res.headersSent) {
      res.status(500).json({
        status: 'ERROR',
        message: 'Server initialization failed',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};
