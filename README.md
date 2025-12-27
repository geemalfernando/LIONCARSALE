# 🦁 Lion Car Sale

A modern web application for browsing and searching vehicles with advanced filtering capabilities.

## Features

- 🚗 Browse vehicles with photos
- 🔍 Search vehicles by title
- 🎯 Filter by year and make
- 📅 Filter by year range (min/max)
- 📱 Responsive design

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express, GraphQL (Apollo Server)
- **Database**: PostgreSQL

## Project Structure

```
LIon car sale/
├── backend/          # Express API server with GraphQL
│   ├── config/       # Database configuration
│   ├── models/       # PostgreSQL models
│   ├── graphql/      # GraphQL schema and resolvers
│   └── server.js     # Server entry point
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/    # GraphQL client utilities
│   │   └── App.js
│   └── public/
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (local or cloud - see POSTGRESQL_SETUP.md)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5001
DATABASE_URL=postgresql://username:password@localhost:5432/lion_car_sale
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

See `POSTGRESQL_SETUP.md` for detailed database setup instructions.

4. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5001`
GraphQL endpoint: `http://localhost:5001/graphql`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## GraphQL API

The application uses GraphQL for all API operations. The GraphQL endpoint is available at:
- **GraphQL Endpoint**: `http://localhost:5001/graphql`
- **GraphQL Playground**: `http://localhost:5001/graphql` (interactive query interface)

### GraphQL Queries

#### Get All Vehicles (with filters)
```graphql
query GetVehicles($filter: VehicleFilter) {
  vehicles(filter: $filter) {
    id
    title
    make
    model
    year
    price
    images
    description
    mileage
    color
    fuelType
    transmission
  }
}
```

Variables:
```json
{
  "filter": {
    "search": "toyota",
    "year": 2020,
    "make": "Toyota",
    "minYear": 2018,
    "maxYear": 2022
  }
}
```

#### Get Single Vehicle
```graphql
query GetVehicle($id: ID!) {
  vehicle(id: $id) {
    id
    title
    make
    model
    year
    price
    images
    description
  }
}
```

#### Get Filter Options
```graphql
query GetFilters {
  makes
  years
}
```

### GraphQL Mutations

#### Create Vehicle
```graphql
mutation CreateVehicle($input: VehicleInput!) {
  createVehicle(input: $input) {
    id
    title
    make
    model
    year
    price
  }
}
```

Variables:
```json
{
  "input": {
    "title": "2020 Toyota Camry",
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "price": 25000,
    "images": ["https://example.com/car.jpg"],
    "description": "Excellent condition",
    "mileage": 30000,
    "color": "Silver",
    "fuelType": "Petrol",
    "transmission": "Automatic"
  }
}
```

## Vehicle Model

```javascript
{
  title: String (required),
  make: String (required),
  model: String (required),
  year: Number (required, 1900-current year),
  price: Number (required),
  images: [String],
  description: String,
  mileage: Number,
  color: String,
  fuelType: String (Petrol, Diesel, Electric, Hybrid, Other),
  transmission: String (Manual, Automatic, CVT)
}
```

## Adding Sample Data

You can add vehicles using the API:

```bash
curl -X POST http://localhost:5000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "2020 Toyota Camry",
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "price": 25000,
    "images": ["https://example.com/car1.jpg"],
    "description": "Excellent condition, one owner",
    "mileage": 30000,
    "color": "Silver",
    "fuelType": "Petrol",
    "transmission": "Automatic"
  }'
```

## Development

### Running Both Servers

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

## 🚀 Free Hosting with Custom Domain - NO CARD REQUIRED!

This application can be hosted **100% FREE** with your own custom domain - **NO CREDIT CARD NEEDED!**

### 📖 Complete Hosting Guide
See **[HOSTING.md](./HOSTING.md)** for a complete step-by-step guide to host your application from scratch.

The guide covers:
- ✅ Database setup (Supabase, Neon.tech - FREE, NO CARD)
- ✅ Backend deployment (Cyclic.sh, Fly.io - FREE, NO CARD)
- ✅ Frontend deployment (Vercel, Netlify, Firebase - FREE, NO CARD)
- ✅ Custom domain setup
- ✅ Environment variables configuration
- ✅ Troubleshooting tips

### Recommended Free Setup (NO CARD):
- **Frontend**: Vercel or Netlify (100% Free, NO CARD)
- **Backend**: Cyclic.sh or Fly.io (100% Free, NO CARD)
- **Database**: Supabase or Neon.tech (100% Free, NO CARD)
- **Total Cost**: **$0/month** (only domain ~$10/year)
- **Card Required**: ❌ **NO**

All platforms provide:
- ✅ Free SSL/HTTPS certificates
- ✅ Custom domain support
- ✅ Automatic deployments from GitHub
- ✅ Free tier sufficient for small to medium apps
- ✅ **NO credit card required**

## License

MIT

