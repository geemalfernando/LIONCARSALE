// Vercel serverless function wrapper for GraphQL
const app = require('../backend/server');

module.exports = async (req, res) => {
  const expressApp = await app();
  return expressApp(req, res);
};
