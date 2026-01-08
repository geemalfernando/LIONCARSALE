// Vercel serverless function - Main API handler
const express = require('express');
const cors = require('cors');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');

const { initializeDatabase } = require('../backend/config/database');
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

// Serve uploaded files statically (for production, use CDN)
app.use('/uploads', express.static(path.join(__dirname, '../backend/uploads')));

// File upload routes
app.use('/api/upload', require('../backend/routes/upload'));

// Apollo Server instance
let apolloServer = null;
let serverInitialized = false;

// Initialize Apollo Server and database
async function initializeServer() {
  if (serverInitialized) {
    return;
  }

  try {
    // Connect to database
    await initializeDatabase();
    console.log('✅ MongoDB database ready');

    // Create Apollo Server
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
    
    serverInitialized = true;
    console.log('✅ Apollo Server started');
  } catch (err) {
    console.error('❌ Server initialization error:', err.message);
  }
}

// Health check
app.get('/api/health', async (req, res) => {
  await initializeServer();
  res.json({ 
    status: 'OK', 
    message: 'Lion Car Sale GraphQL API is running',
    database: 'MongoDB',
    graphql: `${req.protocol}://${req.get('host')}/graphql`
  });
});

// Root route
app.get('/', async (req, res) => {
  await initializeServer();
  res.json({ 
    status: 'OK', 
    message: 'Lion Car Sale API Server',
    endpoints: {
      graphql: `${req.protocol}://${req.get('host')}/graphql`,
      health: `${req.protocol}://${req.get('host')}/api/health`
    }
  });
});

// Vercel serverless function handler
module.exports = async (req, res) => {
  // Initialize server if not already done
  await initializeServer();
  
  // Handle the request
  return app(req, res);
};
