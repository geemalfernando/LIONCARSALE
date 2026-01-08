const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { mongoose, connectDatabase } = require('../config/database');

// Helper function to ensure database is connected
async function ensureConnected() {
  // Check if already connected and verified
  if (mongoose.connection.readyState === 1) {
    try {
      // Quick ping to verify connection is alive
      await mongoose.connection.db.admin().ping();
      return;
    } catch (pingError) {
      console.log('⚠️  Connection ping failed, reconnecting...');
      mongoose.connection.readyState = 0; // Force reconnect
    }
  }
  
  // Not connected, attempt connection
  console.log('⚠️  Database not connected, attempting to connect...');
  try {
    await connectDatabase();
    
    // Verify connection is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection not ready after connect');
    }
    
    // Verify with ping
    await mongoose.connection.db.admin().ping();
    console.log('✅ Database connection verified');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

// GET /api/vehicles - Get all vehicles with optional filters
router.get('/', async (req, res) => {
  try {
    await ensureConnected();
    
    const filter = {};
    
    // Search by title (matches model's $text search)
    if (req.query.search) {
      filter.search = req.query.search;
    }
    
    // Filter by make
    if (req.query.make) {
      filter.make = req.query.make;
    }
    
    // Filter by year - prioritize year range over exact year
    if (req.query.minYear || req.query.maxYear) {
      // Year range takes priority
      if (req.query.minYear) filter.minYear = parseInt(req.query.minYear);
      if (req.query.maxYear) filter.maxYear = parseInt(req.query.maxYear);
    } else if (req.query.year) {
      // Exact year only if no range specified
      filter.year = parseInt(req.query.year);
    }
    
    const vehicles = await Vehicle.findAll(filter);
    
    res.json({
      status: 'OK',
      data: vehicles,
      count: vehicles.length
    });
  } catch (error) {
    console.error('❌ Error fetching vehicles:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Failed to fetch vehicles',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// IMPORTANT: Specific routes must come before parameterized routes
// GET /api/vehicles/filters/makes - Get distinct makes
router.get('/filters/makes', async (req, res) => {
  try {
    await ensureConnected();
    
    const makes = await Vehicle.getDistinctMakes();
    
    res.json({
      status: 'OK',
      data: makes
    });
  } catch (error) {
    console.error('❌ Error fetching makes:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Failed to fetch makes',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET /api/vehicles/filters/years - Get distinct years
router.get('/filters/years', async (req, res) => {
  try {
    await ensureConnected();
    
    const years = await Vehicle.getDistinctYears();
    
    res.json({
      status: 'OK',
      data: years
    });
  } catch (error) {
    console.error('❌ Error fetching years:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Failed to fetch years',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// POST /api/vehicles - Create new vehicle
router.post('/', async (req, res) => {
  try {
    await ensureConnected();
    
    const vehicle = await Vehicle.create(req.body);
    
    res.status(201).json({
      status: 'OK',
      message: 'Vehicle created successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Failed to create vehicle'
    });
  }
});

// PATCH /api/vehicles/:id - Update vehicle (especially sold status)
router.patch('/:id', async (req, res) => {
  try {
    await ensureConnected();
    
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!vehicle) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Vehicle not found'
      });
    }
    
    res.json({
      status: 'OK',
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Failed to update vehicle'
    });
  }
});

// GET /api/vehicles/:id - Get single vehicle (must be last to not conflict with /filters/*)
router.get('/:id', async (req, res) => {
  try {
    await ensureConnected();
    
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Vehicle not found'
      });
    }
    
    res.json({
      status: 'OK',
      data: vehicle
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Failed to fetch vehicle'
    });
  }
});

module.exports = router;
