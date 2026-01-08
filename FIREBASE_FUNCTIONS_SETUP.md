# 🚀 Firebase Functions Setup Guide

This guide explains how to deploy your Lion Car Sale app using Firebase Functions (serverless backend) + Firebase Hosting + MongoDB.

## 📋 What's Changed

- ✅ **No separate backend server** - Everything runs on Firebase
- ✅ **Frontend**: Firebase Hosting
- ✅ **Backend API**: Firebase Cloud Functions (serverless)
- ✅ **Database**: MongoDB Atlas

---

## 🔧 Initial Setup

### Step 1: Install Dependencies

1. **Install Functions dependencies:**
   ```bash
   cd functions
   npm install
   cd ..
   ```

2. **Install Frontend dependencies (if not already done):**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Step 2: Set Firebase Functions Environment Variables

Set your MongoDB connection string in Firebase Functions config:

```bash
firebase functions:config:set database.url="mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?retryWrites=true&w=majority&appName=geemal"
```

**Note:** You need to update the `functions/src/config/database.js` to read from Firebase config:

```javascript
const databaseUrl = functions.config().database?.url || process.env.DATABASE_URL;
```

Or set it in Firebase Console:
1. Go to Firebase Console → Your Project → Functions → Configuration
2. Add `database.url` with your MongoDB connection string

### Step 3: Update Functions Code to Use Firebase Config

The functions code needs to read from Firebase config. Update `functions/src/config/database.js`:

```javascript
const functions = require('firebase-functions');

let databaseUrl = process.env.DATABASE_URL;

// Try to get from Firebase config (for deployed functions)
try {
  const config = functions.config();
  if (config.database && config.database.url) {
    databaseUrl = config.database.url;
  }
} catch (e) {
  // Running locally or config not set
}

if (!databaseUrl) {
  throw new Error('DATABASE_URL or Firebase config database.url must be set');
}
```

---

## 🚀 Deployment

### Deploy Everything (Functions + Hosting)

```bash
./deploy-firebase.sh
```

Or manually:

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Deploy everything
firebase deploy
```

### Deploy Only Functions

```bash
firebase deploy --only functions
```

### Deploy Only Hosting

```bash
firebase deploy --only hosting
```

---

## 🔍 Testing Locally

### Test Functions Locally

```bash
# Install Firebase emulators
npm install -g firebase-tools

# Start emulators
firebase emulators:start

# In another terminal, test GraphQL endpoint:
curl -X POST http://localhost:5001/your-project-id/us-central1/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ vehicles { id title } }"}'
```

### Test Frontend Locally

```bash
cd frontend
npm start
```

The frontend will try to connect to `/graphql` (relative URL) which will work when deployed, but for local testing, you'll need to either:
1. Run the backend separately, or
2. Use Firebase emulators

---

## 📝 Environment Variables

### Firebase Functions Config

Set in Firebase:
```bash
firebase functions:config:set database.url="your-mongodb-connection-string"
```

### Frontend Environment Variables

For production builds, create `frontend/.env.production`:
```env
REACT_APP_GRAPHQL_URL=/graphql
```

For local development, create `frontend/.env.development`:
```env
REACT_APP_GRAPHQL_URL=http://localhost:5001/graphql
```

---

## 🐛 Troubleshooting

### Functions Not Connecting to MongoDB

1. **Check Firebase Functions config:**
   ```bash
   firebase functions:config:get
   ```

2. **Verify MongoDB connection string** is correct

3. **Check Functions logs:**
   ```bash
   firebase functions:log
   ```

### GraphQL Endpoint Not Found

1. **Verify rewrite rule** in `firebase.json`:
   ```json
   {
     "source": "/graphql",
     "function": "graphql"
   }
   ```

2. **Check Functions are deployed:**
   ```bash
   firebase functions:list
   ```

### CORS Errors

The Functions code already includes CORS headers. If you still get errors:
1. Check Functions logs for errors
2. Verify the request is going to the correct endpoint

---

## 📊 Function URLs

After deployment, your GraphQL endpoint will be:
- **Production**: `https://your-project-id.cloudfunctions.net/graphql`
- **Via Hosting Rewrite**: `https://your-domain.com/graphql` (recommended)

The hosting rewrite makes it available at `/graphql` on your main domain, which is what the frontend uses.

---

## ✅ Summary

1. ✅ Install dependencies (`cd functions && npm install`)
2. ✅ Set Firebase Functions config: `firebase functions:config:set database.url="..."`
3. ✅ Update `functions/src/config/database.js` to read from Firebase config
4. ✅ Deploy: `firebase deploy`
5. ✅ Test your app at your Firebase Hosting URL

Everything is now serverless and hosted on Firebase! 🎉

