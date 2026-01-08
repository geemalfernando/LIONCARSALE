const functions = require('firebase-functions');
const { ApolloServer } = require('apollo-server-cloud-functions');
const { connectDatabase } = require('./config/database');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: async ({ req }) => {
    // Ensure database is connected on each request
    await connectDatabase().catch(err => {
      console.error('Database connection error:', err);
      throw err;
    });
    return { req };
  },
});

// Export GraphQL function
exports.graphql = functions.https.onRequest((req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Use Apollo Server handler
  server.createHandler({
    cors: {
      origin: true,
      credentials: true,
    },
  })(req, res);
});
