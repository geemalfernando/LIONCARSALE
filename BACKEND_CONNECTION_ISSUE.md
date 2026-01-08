# Backend Database Connection Issue

## Problem
Your backend is returning: `"Database connection not established"` when trying to fetch vehicles.

This means the Vercel backend can't connect to MongoDB Atlas.

## Quick Fix: Use Existing Sitemap

**Good news:** You already have a sitemap.xml file with 10 vehicles! 

You can deploy it now:

```bash
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

The existing sitemap in `frontend/public/sitemap.xml` will be used.

## Fix Backend Connection (For Future Updates)

The backend connection issue needs to be fixed in Vercel:

### Step 1: Check Environment Variables in Vercel

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `lioncarsa`
3. Go to Settings → Environment Variables
4. Verify `DATABASE_URL` is set:
   ```
   DATABASE_URL=mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/?appName=geemal
   ```
5. Make sure it's set for **Production** environment

### Step 2: Redeploy Backend

After updating environment variables:

1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

Or trigger a new deployment by pushing a commit.

### Step 3: Test Backend

After redeploy:

```bash
curl https://lioncarsa.vercel.app/api/health
```

Should return:
```json
{"status":"OK","message":"Lion Car Sale API is running",...}
```

### Step 4: Test Vehicles Endpoint

```bash
curl ://lioncarsa.vercel.app/api/vehicleshttps
```

Should return vehicles, not an error.

### Step 5: Regenerate Sitemap

Once backend works:

```bash
node generate-sitemap.js
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

## Check MongoDB Atlas Settings

Also verify:

1. **Network Access:**
   - MongoDB Atlas → Network Access
   - Should allow `0.0.0.0/0` (all IPs) for Vercel

2. **Database User:**
   - MongoDB Atlas → Database Access
   - User `geemal` should have read/write permissions

3. **Database Name:**
   - Connection string should include database name or it will use default
   - Your URL has `appName=geemal` but may need explicit database name

## For Now: Deploy Existing Sitemap

Since you already have a working sitemap.xml with vehicles, just deploy it:

```bash
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

Then test: `https://auditra-web.web.app/sitemap.xml`

Fix the backend connection later to regenerate the sitemap when you add new vehicles.

