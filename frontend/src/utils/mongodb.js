// MongoDB Atlas Data API - Direct connection from frontend
// No backend needed!

const MONGODB_API_KEY = process.env.REACT_APP_MONGODB_API_KEY;
const MONGODB_APP_ID = process.env.REACT_APP_MONGODB_APP_ID;
const MONGODB_DATA_SOURCE = process.env.REACT_APP_MONGODB_DATA_SOURCE || 'Cluster0';
const MONGODB_DATABASE = process.env.REACT_APP_MONGODB_DATABASE || 'lion_car_sale';
const MONGODB_COLLECTION = process.env.REACT_APP_MONGODB_COLLECTION || 'vehicles';

// Get the base URL for MongoDB Data API
function getDataApiUrl() {
  if (!MONGODB_APP_ID) {
    throw new Error('MongoDB App ID not configured. Please set REACT_APP_MONGODB_APP_ID');
  }
  return `https://data.mongodb-api.com/app/${MONGODB_APP_ID}/endpoint/data/v1/action`;
}

// Helper function to make MongoDB Data API requests
async function mongodbRequest(action, requestBody = {}) {
  if (!MONGODB_API_KEY) {
    throw new Error('MongoDB Data API credentials not configured. Please set REACT_APP_MONGODB_API_KEY');
  }

  const url = `${getDataApiUrl()}/${action}`;
  
  const body = {
    dataSource: MONGODB_DATA_SOURCE,
    database: MONGODB_DATABASE,
    collection: MONGODB_COLLECTION,
    ...requestBody,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': MONGODB_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { message: errorText };
    }
    throw new Error(error.message || 'MongoDB request failed');
  }

  return response.json();
}

// Fetch all vehicles with optional filters
export async function fetchVehicles(filters = {}) {
  try {
    const filter = {};

    // Search by title (text search - MongoDB supports regex)
    if (filters.search) {
      filter.title = { $regex: filters.search, $options: 'i' };
    }

    // Filter by exact year
    if (filters.year) {
      filter.year = parseInt(filters.year);
    }

    // Filter by year range
    if (filters.minYear || filters.maxYear) {
      filter.year = {};
      if (filters.minYear) {
        filter.year.$gte = parseInt(filters.minYear);
      }
      if (filters.maxYear) {
        filter.year.$lte = parseInt(filters.maxYear);
      }
    }

    // Filter by make (case-insensitive)
    if (filters.make) {
      filter.make = { $regex: `^${filters.make}$`, $options: 'i' };
    }

    const result = await mongodbRequest('find', {
      filter,
      sort: { createdAt: -1 },
    });

    // Transform MongoDB documents to match GraphQL format
    return result.documents.map(doc => ({
      _id: doc._id.$oid,
      id: doc._id.$oid,
      title: doc.title,
      make: doc.make,
      model: doc.model,
      year: doc.year,
      price: doc.price,
      images: doc.images || [],
      description: doc.description || '',
      mileage: doc.mileage || 0,
      color: doc.color || '',
      fuelType: doc.fuelType || 'Petrol',
      transmission: doc.transmission || 'Manual',
      createdAt: doc.createdAt?.$date || new Date().toISOString(),
      updatedAt: doc.updatedAt?.$date || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
}

// Fetch single vehicle by ID
export async function fetchVehicleById(id) {
  try {
    const result = await mongodbRequest('findOne', {
      filter: { _id: { $oid: id } },
    });

    if (!result.document) {
      return null;
    }

    const doc = result.document;
    return {
      _id: doc._id.$oid,
      id: doc._id.$oid,
      title: doc.title,
      make: doc.make,
      model: doc.model,
      year: doc.year,
      price: doc.price,
      images: doc.images || [],
      description: doc.description || '',
      mileage: doc.mileage || 0,
      color: doc.color || '',
      fuelType: doc.fuelType || 'Petrol',
      transmission: doc.transmission || 'Manual',
      createdAt: doc.createdAt?.$date || new Date().toISOString(),
      updatedAt: doc.updatedAt?.$date || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    throw error;
  }
}

// Get distinct makes
export async function fetchMakes() {
  try {
    const result = await mongodbRequest('find', {
      filter: {},
      projection: { make: 1 },
    });

    const makes = [...new Set(result.documents.map(doc => doc.make))];
    return makes.sort();
  } catch (error) {
    console.error('Error fetching makes:', error);
    throw error;
  }
}

// Get distinct years
export async function fetchYears() {
  try {
    const result = await mongodbRequest('find', {
      filter: {},
      projection: { year: 1 },
    });

    const years = [...new Set(result.documents.map(doc => doc.year))];
    return years.sort((a, b) => b - a);
  } catch (error) {
    console.error('Error fetching years:', error);
    throw error;
  }
}

// Create vehicle (for admin panel)
export async function createVehicle(vehicleData) {
  try {
    const result = await mongodbRequest('insertOne', {}, {
      document: {
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      ...vehicleData,
      _id: result.insertedId,
      id: result.insertedId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
}

