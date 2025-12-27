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

// PostgreSQL Connection and Initialization
async function connectDatabase() {
  try {
    await initializeDatabase();
    console.log('✅ PostgreSQL database ready');
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Check your DATABASE_URL connection string');
    console.error('2. Ensure PostgreSQL server is running');
    console.error('3. Verify database credentials in .env file');
    console.error('4. Check if database exists');
    process.exit(1);
  }
}

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production', // Disable in production
  playground: process.env.NODE_ENV !== 'production', // Disable in production
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
      database: 'PostgreSQL',
      graphql: `http://localhost:${PORT}${server.graphqlPath}`
    });
  });

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();

