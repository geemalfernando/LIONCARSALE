require('dotenv').config();
const { initializeDatabase, pool } = require('./config/database');
const Vehicle = require('./models/Vehicle');

async function testConnection() {
  try {
    console.log('🔌 Testing PostgreSQL Connection...\n');
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in .env file');
      console.log('\nPlease add DATABASE_URL to your .env file:');
      console.log('DATABASE_URL=postgresql://username:password@localhost:5432/lion_car_sale');
      process.exit(1);
    }

    console.log('📝 Connection String:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
    console.log('');

    // Initialize database
    console.log('⏳ Connecting to PostgreSQL...');
    await initializeDatabase();
    console.log('✅ Connected to PostgreSQL successfully!\n');

    // Get database info
    const result = await pool.query('SELECT current_database() as db_name, version() as version');
    console.log(`📊 Database: ${result.rows[0].db_name}`);
    console.log(`📊 PostgreSQL Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);

    // Check vehicles table
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'vehicles'
      )
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Vehicles table exists');
      
      const vehicleCount = await Vehicle.countDocuments();
      console.log(`🚗 Vehicles in database: ${vehicleCount}`);

      if (vehicleCount > 0) {
        console.log('\n📋 Sample vehicles:');
        const vehicles = await Vehicle.findAll({});
        vehicles.slice(0, 3).forEach((v, i) => {
          console.log(`   ${i + 1}. ${v.title} - ${v.make} ${v.model} (${v.year})`);
        });
      } else {
        console.log('\n💡 Tip: Run "npm run seed" to add sample vehicles');
      }
    } else {
      console.log('⚠️  Vehicles table does not exist');
    }

    await pool.end();
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    
    if (error.message.includes('password authentication failed')) {
      console.error('1. Check your PostgreSQL username and password');
      console.error('2. Verify the password in the connection string is correct');
    } else if (error.message.includes('does not exist')) {
      console.error('1. Database does not exist - create it first');
      console.error('2. Run: createdb lion_car_sale (or create via pgAdmin)');
    } else if (error.message.includes('connection refused') || error.message.includes('ECONNREFUSED')) {
      console.error('1. PostgreSQL server is not running');
      console.error('2. Start PostgreSQL: brew services start postgresql (Mac) or sudo systemctl start postgresql (Linux)');
      console.error('3. Check if PostgreSQL is listening on the correct port (default: 5432)');
    } else if (error.message.includes('timeout')) {
      console.error('1. Check your internet connection (if using cloud database)');
      console.error('2. Verify the host address is correct');
      console.error('3. Check firewall settings');
    }
    
    console.error('\n📖 Connection String Format:');
    console.error('DATABASE_URL=postgresql://username:password@host:port/database');
    console.error('Example: postgresql://postgres:mypassword@localhost:5432/lion_car_sale');
    
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

testConnection();
