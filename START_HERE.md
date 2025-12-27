# 🚀 How to Start the Application

## Quick Start (Recommended)

### Option 1: Use the Start Script
```bash
cd "LIon car sale"
./start.sh
```

### Option 2: Manual Start (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd "LIon car sale/backend"
npm start
```

**Terminal 2 - Frontend:**
```bash
cd "LIon car sale/frontend"
npm start
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend GraphQL**: http://localhost:5001/graphql
- **Admin Panel**: http://localhost:3000/admin (Password: `LionCar2024!`)

## Stop the Servers

Press `Ctrl+C` in each terminal, or run:
```bash
pkill -f 'node.*server.js'
pkill -f 'react-scripts'
```

## Troubleshooting

### Port Already in Use
If port 5001 or 3000 is already in use:
```bash
# Kill process on port 5001 (backend)
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
- Check your `.env` file in the `backend` folder
- Verify PostgreSQL connection string (DATABASE_URL) is correct
- Ensure database is running and accessible
- See `POSTGRESQL_SETUP.md` for database setup help

### Dependencies Not Installed
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Next Steps

- See `HOSTING.md` for complete production deployment guide (FREE, NO CARD REQUIRED)
- See `POSTGRESQL_SETUP.md` for database setup instructions

