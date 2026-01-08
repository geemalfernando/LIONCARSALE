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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health check (works immediately, no initialization needed)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Lion Car Sale API is running',
    database: 'MongoDB',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Lion Car Sale API Server',
    endpoints: {
      graphql: `${req.protocol}://${req.get('host')}/graphql`,
      health: `${req.protocol}://${req.get('host')}/api/health`
    }
  });
});

// Apollo Server and database initialization (lazy loaded)
let apolloServer = null;
let initializationPromise = null;

async function initializeApolloServer() {
  // If already initialized, return
  if (apolloServer) {
    return apolloServer;
  }

  // If initialization in progress, wait
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      console.log('🔌 Initializing Apollo Server and database...');

      // Import dependencies (lazy load)
      const { ApolloServer } = require('apollo-server-express');
      const { initializeDatabase, mongoose } = require('../backend/config/database');
      const typeDefs = require('../backend/graphql/schema');
      const resolvers = require('../backend/graphql/resolvers');

      // Connect to database
      try {
        if (mongoose.connection.readyState !== 1) {
          await initializeDatabase();
          console.log('✅ MongoDB database ready');
        }
      } catch (dbError) {
        console.error('⚠️  Database connection failed:', dbError.message);
        // Continue - GraphQL queries will fail but API won't crash
      }

      // Create and start Apollo Server
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
      return apolloServer;
    } catch (err) {
      console.error('❌ Apollo Server initialization error:', err.message);
      console.error('Stack:', err.stack);
      initializationPromise = null;
      throw err;
    }
  })();

  return initializationPromise;
}

// GraphQL endpoint - lazy load Apollo Server
app.all('/graphql', async (req, res, next) => {
  try {
    await initializeApolloServer();
    // Use Apollo Server handler
    return apolloServer.createHandler({ 
      path: '/graphql',
      disableHealthCheck: true,
      bodyParserConfig: false
    })(req, res);
  } catch (error) {
    console.error('GraphQL initialization error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        status: 'ERROR',
        message: 'GraphQL server not available',
        error: error.message
      });
    }
  }
});

// File upload routes (lazy load)
app.use('/api/upload', async (req, res, next) => {
  try {
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
