const express = require('express');
const cors = require('cors');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

const { initializeDatabase } = require('./config/database');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();

// Middleware - CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Set your frontend domain in production
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload routes
app.use('/api/upload', require('./routes/upload'));

// MongoDB Connection and Initialization
async function connectDatabase() {
  try {
    await initializeDatabase();
    console.log('✅ MongoDB database ready');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Check your DATABASE_URL connection string (MongoDB format)');
    console.error('2. Ensure MongoDB server is running (or MongoDB Atlas is accessible)');
    console.error('3. Verify database credentials in .env file');
    console.error('4. Check if your IP is whitelisted (for MongoDB Atlas)');
    console.error('5. Format: mongodb://username:password@host:port/database or mongodb+srv://... for Atlas');
    // Don't exit in production (Vercel)
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
}

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable for production
  playground: true, // Enable for production
  context: ({ req }) => {
    return { req };
  },
});

// Start Server
async function startServer() {
  // Connect to database first
  await connectDatabase();
  
  // Start Apollo Server
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'Lion Car Sale GraphQL API is running',
      database: 'MongoDB',
      graphql: `${req.protocol}://${req.get('host')}${server.graphqlPath}`
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

  return app;
}

// For Vercel serverless
let appInstance = null;

async function getApp() {
  if (!appInstance) {
    appInstance = await startServer();
  }
  return appInstance;
}

// Export for Vercel
module.exports = async (req, res) => {
  const app = await getApp();
  return app(req, res);
};

// For standalone server
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  startServer().then(app => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}
