require('dotenv').config();
const { initializeDatabase, mongoose } = require('./config/database');
const Vehicle = require('./models/Vehicle');

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB Connection...\n');
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in .env file');
      console.log('\nPlease add DATABASE_URL to your .env file:');
      console.log('DATABASE_URL=mongodb://username:password@host:port/database');
      console.log('Or for MongoDB Atlas:');
      console.log('DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database');
      process.exit(1);
    }

    const maskedUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
    console.log('📝 Connection String:', maskedUrl);
    console.log('');

    // Initialize database
    console.log('⏳ Connecting to MongoDB...');
    await initializeDatabase();
    console.log('✅ Connected to MongoDB successfully!\n');

    // Get database info
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    const adminDb = db.admin();
    const serverInfo = await adminDb.serverStatus();
    const version = serverInfo.version;

    console.log(`📊 Database: ${dbName}`);
    console.log(`📊 MongoDB Version: ${version}`);

    // Check vehicles collection
    const collections = await db.listCollections().toArray();
    const vehiclesCollectionExists = collections.some(c => c.name === 'vehicles');
    
    if (vehiclesCollectionExists) {
      console.log('✅ Vehicles collection exists');
      
      const vehicleCount = await Vehicle.countDocuments({});
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
      console.log('⚠️  Vehicles collection does not exist (will be created on first insert)');
    }

    await mongoose.connection.close();
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('1. Check your MongoDB username and password');
      console.error('2. Verify the password in the connection string is correct');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('1. Check your MongoDB host address');
      console.error('2. Verify the connection string format is correct');
      console.error('3. Ensure your internet connection is working');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('connection refused')) {
      console.error('1. MongoDB server is not running (for local MongoDB)');
      console.error('2. Start MongoDB: brew services start mongodb-community (Mac) or sudo systemctl start mongod (Linux)');
      console.error('3. Check if MongoDB is listening on the correct port (default: 27017)');
    } else if (error.message.includes('timeout')) {
      console.error('1. Check your internet connection (if using MongoDB Atlas)');
      console.error('2. Verify the host address is correct');
      console.error('3. Check firewall settings');
      console.error('4. For MongoDB Atlas: Ensure your IP is whitelisted in Network Access');
    } else if (error.message.includes('SRV') || error.message.includes('mongodb+srv')) {
      console.error('1. Check your MongoDB Atlas connection string');
      console.error('2. Ensure your IP is whitelisted in MongoDB Atlas Network Access');
      console.error('3. Verify your database user has proper permissions');
    }
    
    console.error('\n📖 Connection String Formats:');
    console.error('Local MongoDB: mongodb://username:password@localhost:27017/database');
    console.error('MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database');
    console.error('\nExample: mongodb://mongo:mypassword@localhost:27017/lion_car_sale');
    console.error('Or: mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/lion_car_sale');
    
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
}

testConnection();
