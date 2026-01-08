#!/bin/bash

# Simple Frontend Deployment Script for Firebase Hosting

echo "🚀 Deploying Frontend to Firebase Hosting"
echo "=========================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run: firebase login"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "🏗️  Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend build successful!"
cd ..

# Deploy to Firebase Hosting only
echo ""
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful! 🎉"
    echo ""
    echo "Your frontend is live at:"
    firebase hosting:sites:list
    echo ""
    echo "Backend API: https://lioncarsa.vercel.app"
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi

