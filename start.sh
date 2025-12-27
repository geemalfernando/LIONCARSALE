#!/bin/bash

# Lion Car Sale - Start Script
# This script starts both backend and frontend servers

echo "🦁 Starting Lion Car Sale Application..."
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the 'LIon car sale' directory"
    exit 1
fi

# Start backend
echo "📦 Starting backend server..."
cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend started (PID: $BACKEND_PID)"
echo "   Logs: backend.log"
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend started (PID: $FRONTEND_PID)"
echo "   Logs: frontend.log"
cd ..

echo ""
echo "✅ Application started!"
echo ""
echo "📍 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend GraphQL: http://localhost:5001/graphql"
echo ""
echo "📝 To stop the servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   Or: pkill -f 'node.*server.js' && pkill -f 'react-scripts'"
echo ""

