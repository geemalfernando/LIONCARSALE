#!/bin/bash

# Firebase Deployment Script (Functions + Hosting)
# This script builds and deploys both Functions and Frontend to Firebase

echo "🔥 Firebase Deployment (Functions + Hosting)"
echo "============================================"
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

# Install Functions dependencies
echo "📦 Installing Functions dependencies..."
cd functions
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Functions dependencies already installed"
fi
cd ..

# Build frontend
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo ""
echo "🏗️  Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo ""
echo "✅ Frontend build successful!"
cd ..

# Deploy only hosting (if you're not using Functions)
echo ""
echo "🚀 Deploying to Firebase Hosting..."
echo "⚠️  Note: Functions require Blaze plan. Deploying only Hosting."
echo "⚠️  For backend, deploy to Cyclic.sh or upgrade Firebase to Blaze."
echo ""
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Set DATABASE_URL in Firebase Functions config:"
    echo "   firebase functions:config:set database.url='mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?retryWrites=true&w=majority&appName=geemal'"
    echo ""
    echo "2. Redeploy functions:"
    echo "   firebase deploy --only functions"
    echo ""
    echo "Your app is live at:"
    firebase hosting:sites:list
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi

