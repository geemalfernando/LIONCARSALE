const mongoose = require('mongoose');

// Vehicle Schema
const vehicleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  make: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ''
  },
  mileage: {
    type: Number,
    default: 0,
    min: 0
  },
  color: {
    type: String,
    default: '',
    trim: true
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Other'],
    default: 'Petrol'
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic', 'CVT'],
    default: 'Manual'
  },
  sellerPhone: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      ret._id = ret._id.toString();
      ret.createdAt = ret.createdAt.toISOString();
      ret.updatedAt = ret.updatedAt.toISOString();
      return ret;
    }
  }
});

// Text search index for title
vehicleSchema.index({ title: 'text' });

// Compound indexes for common queries
vehicleSchema.index({ make: 1, year: -1 });
vehicleSchema.index({ year: -1 });

// Static methods
vehicleSchema.statics.findAll = async function(filters = {}) {
  try {
    const query = {};

    // Search by title, make, or model (case-insensitive)
    if (filters.search && filters.search.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { make: searchRegex },
        { model: searchRegex },
        { description: searchRegex }
      ];
    }

    // Filter by year - prioritize year range over exact year
    if (filters.minYear || filters.maxYear) {
      // Year range takes priority
      query.year = {};
      if (filters.minYear) {
        query.year.$gte = parseInt(filters.minYear);
      }
      if (filters.maxYear) {
        query.year.$lte = parseInt(filters.maxYear);
      }
    } else if (filters.year) {
      // Exact year filter (only if no year range)
      query.year = parseInt(filters.year);
    }

    // Filter by make (case-insensitive)
    if (filters.make) {
      query.make = new RegExp(`^${filters.make}$`, 'i');
    }

    let vehiclesQuery = this.find(query);

    // Sort by creation date descending (default)
    vehiclesQuery = vehiclesQuery.sort({ createdAt: -1 });

    const vehicles = await vehiclesQuery.exec();
    return vehicles.map(v => {
      const vehicle = v.toJSON();
      // Convert _id to id for frontend compatibility
      if (vehicle._id) {
        vehicle.id = vehicle._id.toString();
        delete vehicle._id;
      }
      return vehicle;
    });
  } catch (error) {
    throw new Error(`Error fetching vehicles: ${error.message}`);
  }
};

vehicleSchema.statics.findById = async function(id) {
  try {
    const vehicle = await this.findOne({ _id: id });
    if (!vehicle) {
      return null;
    }
    const vehicleObj = vehicle.toJSON();
    // Convert _id to id for frontend compatibility
    if (vehicleObj._id) {
      vehicleObj.id = vehicleObj._id.toString();
      delete vehicleObj._id;
    }
    return vehicleObj;
  } catch (error) {
    throw new Error(`Error fetching vehicle: ${error.message}`);
  }
};

vehicleSchema.statics.create = async function(vehicleData) {
  try {
    const vehicle = new this(vehicleData);
    await vehicle.save();
    const vehicleObj = vehicle.toJSON();
    // Convert _id to id for frontend compatibility
    if (vehicleObj._id) {
      vehicleObj.id = vehicleObj._id.toString();
      delete vehicleObj._id;
    }
    return vehicleObj;
  } catch (error) {
    throw new Error(`Error creating vehicle: ${error.message}`);
  }
};

vehicleSchema.statics.getDistinctMakes = async function() {
  try {
    const makes = await this.distinct('make');
    return makes.sort();
  } catch (error) {
    throw new Error(`Error fetching makes: ${error.message}`);
  }
};

vehicleSchema.statics.getDistinctYears = async function() {
  try {
    const years = await this.distinct('year');
    return years.sort((a, b) => b - a); // Descending order
  } catch (error) {
    throw new Error(`Error fetching years: ${error.message}`);
  }
};

// Note: Mongoose already provides countDocuments as a native method
// We can use Vehicle.countDocuments({}) directly or Vehicle.countDocuments(query)
// For filtered counts with search, use the query builder pattern

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
