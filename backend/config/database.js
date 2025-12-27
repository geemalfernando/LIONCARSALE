const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ PostgreSQL connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

// Initialize database and create tables if they don't exist
async function initializeDatabase() {
  try {
    // Create vehicles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
        price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
        images TEXT[] DEFAULT '{}',
        description TEXT DEFAULT '',
        mileage INTEGER DEFAULT 0,
        color VARCHAR(50) DEFAULT '',
        fuel_type VARCHAR(20) DEFAULT 'Petrol' CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid', 'Other')),
        transmission VARCHAR(20) DEFAULT 'Manual' CHECK (transmission IN ('Manual', 'Automatic', 'CVT')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for faster searches
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_vehicles_make ON vehicles(make);
      CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles(year);
      CREATE INDEX IF NOT EXISTS idx_vehicles_title ON vehicles USING gin(to_tsvector('english', title));
    `);

    // Create function to update updated_at timestamp
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create trigger to auto-update updated_at
    await pool.query(`
      DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
      CREATE TRIGGER update_vehicles_updated_at
      BEFORE UPDATE ON vehicles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  initializeDatabase
};

