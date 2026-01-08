require('dotenv').config();
const { initializeDatabase, mongoose } = require('./config/database');
const Vehicle = require('./models/Vehicle');

const sampleVehicles = [
  {
    title: "2020 Toyota Camry SE",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    price: 25000,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800"
    ],
    description: "Excellent condition, one owner, well maintained. Perfect for daily commuting.",
    mileage: 30000,
    color: "Silver",
    fuelType: "Petrol",
    transmission: "Automatic"
  },
  {
    title: "2019 Honda Civic LX",
    make: "Honda",
    model: "Civic",
    year: 2019,
    price: 22000,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800"
    ],
    description: "Reliable and fuel-efficient. Great for city driving.",
    mileage: 35000,
    color: "White",
    fuelType: "Petrol",
    transmission: "Manual"
  },
  {
    title: "2021 Ford F-150 XLT",
    make: "Ford",
    model: "F-150",
    year: 2021,
    price: 45000,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800"
    ],
    description: "Powerful truck with excellent towing capacity. Perfect for work or adventure.",
    mileage: 15000,
    color: "Black",
    fuelType: "Petrol",
    transmission: "Automatic"
  },
  {
    title: "2022 Tesla Model 3",
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    price: 42000,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800"
    ],
    description: "Electric vehicle with autopilot. Low maintenance and eco-friendly.",
    mileage: 12000,
    color: "Red",
    fuelType: "Electric",
    transmission: "Automatic"
  },
  {
    title: "2018 BMW 3 Series",
    make: "BMW",
    model: "3 Series",
    year: 2018,
    price: 32000,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800"
    ],
    description: "Luxury sedan with premium features. Sporty and comfortable.",
    mileage: 45000,
    color: "Blue",
    fuelType: "Petrol",
    transmission: "Automatic"
  },
  {
    title: "2020 Toyota RAV4",
    make: "Toyota",
    model: "RAV4",
    year: 2020,
    price: 28000,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800"
    ],
    description: "Compact SUV perfect for families. Great fuel economy.",
    mileage: 28000,
    color: "Gray",
    fuelType: "Hybrid",
    transmission: "Automatic"
  },
  {
    title: "2019 Mercedes-Benz C-Class",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2019,
    price: 38000,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800"
    ],
    description: "Elegant luxury sedan with advanced technology features.",
    mileage: 25000,
    color: "Black",
    fuelType: "Petrol",
    transmission: "Automatic"
  },
  {
    title: "2021 Chevrolet Silverado",
    make: "Chevrolet",
    model: "Silverado",
    year: 2021,
    price: 40000,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800"
    ],
    description: "Full-size pickup truck with powerful engine and spacious interior.",
    mileage: 18000,
    color: "White",
    fuelType: "Diesel",
    transmission: "Automatic"
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding MongoDB database...\n');
    
    // Initialize database (connect to MongoDB)
    await initializeDatabase();
    console.log('✅ Database initialized\n');

    // Clear existing vehicles
    await Vehicle.deleteMany({});
    console.log('🧹 Cleared existing vehicles\n');

    // Insert sample vehicles
    console.log('📝 Inserting sample vehicles...');
    for (const vehicleData of sampleVehicles) {
      await Vehicle.create(vehicleData);
    }
    console.log(`✅ Inserted ${sampleVehicles.length} vehicles\n`);

    // Verify
    const count = await Vehicle.countDocuments({});
    console.log(`📊 Total vehicles in database: ${count}`);
    console.log('\n🎉 Database seeded successfully!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
}

seedDatabase();
