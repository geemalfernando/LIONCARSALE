# How to Check Vercel Logs for 500 Errors

## Step-by-Step Guide

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Login if needed

### 2. Select Your Project
- Click on your project: `lioncarsa` or `lioncarsale2`

### 3. View Deployments
- Click on **"Deployments"** tab
- You'll see a list of deployments

### 4. Open Latest Deployment
- Click on the **latest deployment** (top of the list)
- It should show "Ready" status

### 5. View Logs
- Click on **"Logs"** tab (or button)
- You'll see real-time logs from your serverless function

### 6. Look for Errors
Scroll through the logs and look for:
- ❌ Error messages
- 🔌 MongoDB connection messages
- Database connection errors
- Stack traces

## What to Look For

### Good Signs:
```
🔌 Initializing database connection...
⏳ Connecting to MongoDB...
✅ MongoDB connected successfully
✅ Database initialized
```

### Bad Signs:
```
❌ MongoDB connection error: ...
Database connection failed: ...
Vehicles route error: ...
```

## Common Error Messages

### 1. "DATABASE_URL environment variable is not set"
**Fix**: Add DATABASE_URL in Vercel Settings → Environment Variables

### 2. "Database connection failed"
**Fix**: 
- Check MongoDB Atlas Network Access (allow 0.0.0.0/0)
- Verify DATABASE_URL is correct
- Check user permissions

### 3. "SSL/TLS error"
**Fix**: 
- Verify connection string format
- Check MongoDB Atlas is accessible

### 4. "Operation buffering timed out"
**Fix**: Database connection not established before queries

## Copy Error Message
When you find an error in the logs, copy the full error message and share it. This will help diagnose the exact issue.

## Test Health Endpoint First

Before checking logs, test the health endpoint:
```
curl https://lioncarsa.vercel.app/api/health
```

This will show if the database connection is working:
```json
{
  "status": "OK",
  "dbStatus": "connected"  // Should be "connected"
}
```

If `dbStatus` is `"disconnected"`, the database connection is the issue.

