# MongoDB Connection Timeout Fix

## Problem
The GraphQL queries were timing out with error:
```
Operation `vehicles.find()` buffering timed out after 10000ms
```

This happens when Mongoose tries to execute queries before the MongoDB connection is established.

## Fixes Applied

### 1. Increased Connection Timeouts
- **Before**: 10 seconds (`serverSelectionTimeoutMS: 10000`)
- **After**: 30 seconds (`serverSelectionTimeoutMS: 30000`)
- Also added `connectTimeoutMS: 30000` for better control

### 2. Connection Verification
- Added database ping verification after connection
- Connection is verified before Apollo Server starts
- Better error logging to diagnose connection issues

### 3. Connection Checks in Resolvers
- All GraphQL resolvers now check connection before running queries
- If not connected, automatically attempts to connect
- Prevents queries from running without active connection

### 4. Better Error Handling
- API initialization now fails if database connection fails
- Prevents server from starting without database
- More detailed error messages for debugging

## Files Changed

1. `backend/config/database.js`
   - Increased timeouts
   - Added connection verification
   - Better error handling

2. `backend/graphql/resolvers.js`
   - Added `ensureConnected()` helper function
   - All resolvers check connection before queries

3. `api/index.js`
   - Database connection is required before Apollo Server starts
   - Better error messages and logging

## Verify Vercel Environment Variables

Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal
NODE_ENV=production
```

**Important**: The database name (`lion_car_sale`) must be in the connection string!

## Next Steps

1. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Fix MongoDB connection timeout - increase timeouts and add connection checks"
   git push
   ```

2. **Wait for Vercel deployment** (automatic after push)

3. **Test the GraphQL endpoint**:
   ```bash
   curl --request POST \
     --header 'content-type: application/json' \
     --url 'https://lioncarsa.vercel.app/graphql' \
     --data '{"query":"query { vehicles { id title make model year price } }"}'
   ```

4. **Check Vercel logs** if issues persist:
   - Go to Vercel Dashboard
   - Select your project
   - Click "Deployments" → Latest deployment → "Logs"
   - Look for MongoDB connection messages

## Troubleshooting

If you still get connection errors:

1. **Verify DATABASE_URL in Vercel**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Make sure `DATABASE_URL` is set correctly
   - Ensure it includes the database name: `/lion_car_sale`

2. **Check MongoDB Atlas Network Access**
   - Go to MongoDB Atlas → Network Access
   - Make sure "Allow Access from Anywhere" (0.0.0.0/0) is enabled
   - Or add Vercel's IP ranges

3. **Check MongoDB Atlas Database User**
   - Go to MongoDB Atlas → Database Access
   - Verify user `geemal` has read/write permissions
   - Check password is correct

4. **Check Vercel Logs**
   - Look for connection error messages
   - Check if DATABASE_URL is being read correctly

## Connection State Values

Mongoose connection states:
- `0` = disconnected
- `1` = connected ✅
- `2` = connecting
- `3` = disconnecting

The code now ensures state `1` (connected) before any queries run.

