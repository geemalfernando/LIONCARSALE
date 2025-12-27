const { pool } = require('../config/database');

class Vehicle {
  // Get all vehicles with optional filters
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM vehicles WHERE 1=1';
      const params = [];
      let paramCount = 1;

      // Search by title
      if (filters.search) {
        query += ` AND to_tsvector('english', title) @@ plainto_tsquery('english', $${paramCount})`;
        params.push(filters.search);
        paramCount++;
      }

      // Filter by exact year
      if (filters.year) {
        query += ` AND year = $${paramCount}`;
        params.push(parseInt(filters.year));
        paramCount++;
      }

      // Filter by year range
      if (filters.minYear || filters.maxYear) {
        if (filters.minYear && filters.maxYear) {
          query += ` AND year BETWEEN $${paramCount} AND $${paramCount + 1}`;
          params.push(parseInt(filters.minYear), parseInt(filters.maxYear));
          paramCount += 2;
        } else if (filters.minYear) {
          query += ` AND year >= $${paramCount}`;
          params.push(parseInt(filters.minYear));
          paramCount++;
        } else if (filters.maxYear) {
          query += ` AND year <= $${paramCount}`;
          params.push(parseInt(filters.maxYear));
          paramCount++;
        }
      }

      // Filter by make
      if (filters.make) {
        query += ` AND LOWER(make) = LOWER($${paramCount})`;
        params.push(filters.make);
        paramCount++;
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);
      return result.rows.map(this.mapRowToVehicle);
    } catch (error) {
      throw new Error(`Error fetching vehicles: ${error.message}`);
    }
  }

  // Get vehicle by ID
  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return this.mapRowToVehicle(result.rows[0]);
    } catch (error) {
      throw new Error(`Error fetching vehicle: ${error.message}`);
    }
  }

  // Create new vehicle
  static async create(vehicleData) {
    try {
      const {
        title,
        make,
        model,
        year,
        price,
        images = [],
        description = '',
        mileage = 0,
        color = '',
        fuelType = 'Petrol',
        transmission = 'Manual'
      } = vehicleData;

      const result = await pool.query(
        `INSERT INTO vehicles (title, make, model, year, price, images, description, mileage, color, fuel_type, transmission)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [title, make, model, year, price, images, description, mileage, color, fuelType, transmission]
      );

      return this.mapRowToVehicle(result.rows[0]);
    } catch (error) {
      throw new Error(`Error creating vehicle: ${error.message}`);
    }
  }

  // Get distinct makes
  static async getDistinctMakes() {
    try {
      const result = await pool.query('SELECT DISTINCT make FROM vehicles ORDER BY make');
      return result.rows.map(row => row.make);
    } catch (error) {
      throw new Error(`Error fetching makes: ${error.message}`);
    }
  }

  // Get distinct years
  static async getDistinctYears() {
    try {
      const result = await pool.query('SELECT DISTINCT year FROM vehicles ORDER BY year DESC');
      return result.rows.map(row => row.year);
    } catch (error) {
      throw new Error(`Error fetching years: ${error.message}`);
    }
  }

  // Count documents (for compatibility)
  static async countDocuments(filters = {}) {
    try {
      let query = 'SELECT COUNT(*) FROM vehicles WHERE 1=1';
      const params = [];
      let paramCount = 1;

      if (filters.search) {
        query += ` AND to_tsvector('english', title) @@ plainto_tsquery('english', $${paramCount})`;
        params.push(filters.search);
        paramCount++;
      }

      const result = await pool.query(query, params);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new Error(`Error counting vehicles: ${error.message}`);
    }
  }

  // Map database row to vehicle object
  static mapRowToVehicle(row) {
    return {
      _id: row.id.toString(),
      id: row.id.toString(),
      title: row.title,
      make: row.make,
      model: row.model,
      year: row.year,
      price: parseFloat(row.price),
      images: row.images || [],
      description: row.description || '',
      mileage: row.mileage || 0,
      color: row.color || '',
      fuelType: row.fuel_type,
      transmission: row.transmission,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = Vehicle;
