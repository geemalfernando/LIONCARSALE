#!/bin/bash

# Quick Firebase Setup Script for New Account

echo "🔥 Firebase Setup for New Account"
echo "=================================="
echo ""

# Step 1: Check if logged in
echo "Step 1: Checking Firebase login..."
if ! firebase projects:list &> /dev/null; then
    echo "⚠️  Not logged in to Firebase."
    echo "📝 Please run: firebase login"
    echo "   (This will open a browser for you to sign in)"
    exit 1
fi

echo "✅ Logged in to Firebase"
echo ""

# Step 2: List available projects
echo "Step 2: Listing available projects..."
firebase projects:list
echo ""

# Step 3: Set project
echo "Step 3: Setting Firebase project..."
firebase use lion-car-9b4d6

if [ $? -eq 0 ]; then
    echo "✅ Project set to: lion-car-9b4d6"
else
    echo "⚠️  Project 'lion-car-9b4d6' not found."
    echo "📝 Please select a project from the list above or create a new one."
    echo "   Then run: firebase use YOUR_PROJECT_ID"
    exit 1
fi

echo ""
echo "Step 4: Building frontend..."
cd frontend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

cd ..
echo "✅ Build successful"
echo ""

# Step 5: Deploy
echo "Step 5: Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "Your site should be live at:"
    firebase hosting:sites:list
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi

