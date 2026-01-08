const Vehicle = require('../models/Vehicle');

const resolvers = {
  Query: {
    vehicles: async (_, { filter }) => {
      try {
        const vehicles = await Vehicle.findAll(filter || {});
        return vehicles;
      } catch (error) {
        throw new Error(`Error fetching vehicles: ${error.message}`);
      }
    },

    vehicle: async (_, { id }) => {
      try {
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
        const makes = await Vehicle.getDistinctMakes();
        return makes;
      } catch (error) {
        throw new Error(`Error fetching makes: ${error.message}`);
      }
    },

    years: async () => {
      try {
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
        const vehicle = await Vehicle.create(input);
        return vehicle;
      } catch (error) {
        throw new Error(`Error creating vehicle: ${error.message}`);
      }
    }
  }
};

module.exports = resolvers;

