const Vehicle = require('../models/Vehicle');
const { mongoose, connectDatabase } = require('../config/database');

// Helper function to ensure database is connected
async function ensureConnected() {
  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️  Database not connected, attempting to connect...');
    try {
      await connectDatabase();
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database connection not ready');
      }
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }
}

const resolvers = {
  Query: {
    vehicles: async (_, { filter }) => {
      try {
        await ensureConnected();
        const vehicles = await Vehicle.findAll(filter || {});
        return vehicles;
      } catch (error) {
        throw new Error(`Error fetching vehicles: ${error.message}`);
      }
    },

    vehicle: async (_, { id }) => {
      try {
        await ensureConnected();
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
          throw new Error('Vehicle not found');
        }
        return vehicle;
      } catch (error) {
        throw new Error(`Error fetching vehicle: ${error.message}`);
      }
    },

    makes: async () => {
      try {
        await ensureConnected();
        const makes = await Vehicle.getDistinctMakes();
        return makes;
      } catch (error) {
        throw new Error(`Error fetching makes: ${error.message}`);
      }
    },

    years: async () => {
      try {
        await ensureConnected();
        const years = await Vehicle.getDistinctYears();
        return years;
      } catch (error) {
        throw new Error(`Error fetching years: ${error.message}`);
      }
    }
  },

  Mutation: {
    createVehicle: async (_, { input }) => {
      try {
        await ensureConnected();
        const vehicle = await Vehicle.create(input);
        return vehicle;
      } catch (error) {
        throw new Error(`Error creating vehicle: ${error.message}`);
      }
    }
  }
};

module.exports = resolvers;
