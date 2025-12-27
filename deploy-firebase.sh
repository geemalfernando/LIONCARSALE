#!/bin/bash

# Firebase Hosting Deployment Script
# This script builds and deploys the frontend to Firebase

echo "🔥 Firebase Hosting Deployment"
echo "=============================="
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

# Navigate to frontend directory
cd frontend

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🏗️  Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Go back to root
cd ..

echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "Your app is live at:"
    firebase hosting:sites:list
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi

