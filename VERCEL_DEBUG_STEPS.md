# 🔍 Step-by-Step: Fix Vercel 500 Error

## 🎯 Immediate Action Steps

### Step 1: Check Vercel Deployment Logs ⚠️ MOST IMPORTANT

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select your project

2. **Check Latest Deployment:**
   - Click **"Deployments"** tab
   - Click on the **latest deployment** (top one)
   - Click **"Logs"** tab
   - **Copy the error message you see there**

3. **Look for these common errors:**
   - `DATABASE_URL is not set`
   - `Cannot find module 'xxx'`
   - `MongoDB connection error`
   - `Apollo Server error`

**📝 Write down the exact error message - this tells us what's wrong!**

---

### Step 2: Verify Environment Variables

1. **In Vercel Dashboard:**
   - Go to **"Settings"** → **"Environment Variables"**

2. **Make sure these are set:**
   ```
   DATABASE_URL=mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?retryWrites=true&w=majority&appName=geemal
   NODE_ENV=production
   FRONTEND_URL=https://auditra-web.web.app
   ```

3. **Important:** Add them for **ALL** environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **After adding:**
   - Click **"Save"**
   - Go to **"Deployments"**
   - Click **"Redeploy"** on latest deployment
   - Select **"Use existing Build Cache"** = OFF (to rebuild)

---

### Step 3: Check if MongoDB Connection Works

**Test locally first:**

```bash
cd backend
npm install
npm run test-db
```

If this works locally, the issue is likely in Vercel configuration.

---

### Step 4: Check Vercel Build Logs

1. **In Deployment Logs:**
   - Look at the **"Build"** phase (before "Function" phase)
   - Check if dependencies installed correctly
   - Look for: `npm install` errors

---

## 🔧 Common Fixes

### Fix 1: Missing Environment Variables

**If logs show:** `DATABASE_URL is not set` or `Cannot read property`

**Solution:**
1. Go to Vercel Settings → Environment Variables
2. Add `DATABASE_URL` with your MongoDB connection string
3. Redeploy

### Fix 2: Module Not Found

**If logs show:** `Cannot find module 'express'` or similar

**Solution:**
1. Check root `package.json` exists (I created this)
2. Make sure it has all dependencies
3. Redeploy

### Fix 3: Database Connection Timeout

**If logs show:** `MongoDB connection timeout`

**Solution:**
1. Check MongoDB Atlas Network Access
2. Make sure "Allow Access from Anywhere" (0.0.0.0/0)
3. Check connection string is correct

### Fix 4: Apollo Server Error

**If logs show:** Apollo Server initialization failed

**Solution:**
1. Check GraphQL schema and resolvers
2. Verify all imports are correct
3. Check for syntax errors

---

## 🚀 Quick Test Steps

After fixing, test these URLs:

1. **Root:** `https://your-app.vercel.app/`
   - Should return: `{"status":"OK",...}`

2. **Health:** `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"OK",...}`

3. **GraphQL:** `https://your-app.vercel.app/graphql`
   - Should show GraphQL Playground

---

## 📋 Checklist

Before asking for help, make sure you've:

- ✅ Checked Vercel deployment logs
- ✅ Added environment variables in Vercel
- ✅ Redeployed after adding variables
- ✅ Tested MongoDB connection locally
- ✅ Verified package.json has dependencies
- ✅ Checked build logs for npm install errors

---

## 💬 Share the Error

**To get help, share:**
1. The exact error from Vercel logs
2. Screenshot of environment variables (hide passwords)
3. Build log errors (if any)

---

## 🔄 If Still Not Working

Try these alternative approaches:

1. **Simplify the serverless function** - Remove Apollo Server temporarily
2. **Use a different hosting** - Railway, Render, etc. (simpler for Express apps)
3. **Check MongoDB Atlas** - Make sure it allows connections from all IPs

Let me know what error you see in the logs! 🔍

