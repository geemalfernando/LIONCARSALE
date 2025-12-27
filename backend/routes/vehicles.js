const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// GET all vehicles with filters and search
router.get('/', async (req, res) => {
  try {
    const { search, year, make, minYear, maxYear } = req.query;
    
    // Build query object
    const query = {};
    
    // Search by title (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    // Filter by exact year
    if (year) {
      query.year = parseInt(year);
    }
    
    // Filter by year range
    if (minYear || maxYear) {
      query.year = {};
      if (minYear) {
        query.year.$gte = parseInt(minYear);
      }
      if (maxYear) {
        query.year.$lte = parseInt(maxYear);
      }
    }
    
    // Filter by make (case-insensitive)
    if (make) {
      query.make = { $regex: make, $options: 'i' };
    }
    
    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new vehicle
router.post('/', async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET distinct makes for filter dropdown
router.get('/filters/makes', async (req, res) => {
  try {
    const makes = await Vehicle.distinct('make');
    res.json(makes.sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET distinct years for filter dropdown
router.get('/filters/years', async (req, res) => {
  try {
    const years = await Vehicle.distinct('year');
    res.json(years.sort((a, b) => b - a));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

