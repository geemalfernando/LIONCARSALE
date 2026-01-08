# 🚀 Next Steps: Fix Vercel 500 Error

## ⚠️ Immediate Action Required

When you get a **500: INTERNAL_SERVER_ERROR**, follow these steps **IN ORDER**:

---

## 📋 Step-by-Step Checklist

### ✅ Step 1: Check Vercel Deployment Logs (MOST IMPORTANT!)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your project

2. **View Deployment Logs:**
   - Click **"Deployments"** tab (left sidebar)
   - Click on the **latest deployment** (first one in the list)
   - Click **"Logs"** tab
   - **Scroll through the logs** - look for red errors

3. **Find the Error:**
   - Look for lines starting with `Error:` or `❌`
   - **Copy the error message**
   - Common errors you might see:
     - `DATABASE_URL is not set`
     - `Cannot find module 'express'`
     - `MongoDB connection error`
     - `Apollo Server initialization failed`

**📝 What error do you see? This tells us exactly what's wrong!**

---

### ✅ Step 2: Add Environment Variables in Vercel

**This is the #1 cause of 500 errors!**

1. **In Vercel Dashboard:**
   - Go to **"Settings"** (left sidebar)
   - Click **"Environment Variables"**

2. **Add These Variables:**
   
   Click **"Add New"** for each:

   **Variable 1:**
   - Key: `DATABASE_URL`
   - Value: `mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?retryWrites=true&w=majority&appName=geemal`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

   **Variable 2:**
   - Key: `NODE_ENV`
   - Value: `production`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

   **Variable 3:**
   - Key: `FRONTEND_URL`
   - Value: `https://auditra-web.web.app`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

3. **After Adding Variables:**
   - Go to **"Deployments"** tab
   - Find latest deployment
   - Click **"⋯"** (three dots) → **"Redeploy"**
   - Make sure **"Use existing Build Cache"** is **OFF**
   - Click **"Redeploy"**

---

### ✅ Step 3: Test Basic Endpoints

After redeploy, test these URLs:

1. **Root:** `https://your-app.vercel.app/`
   - Should return: `{"status":"OK",...}`
   - If this works, basic setup is OK ✅

2. **Health:** `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"OK",...}`
   - If this works, Express is working ✅

3. **GraphQL:** `https://your-app.vercel.app/graphql`
   - Should show GraphQL Playground
   - If this works, everything is working ✅

---

## 🔍 Common Issues & Solutions

### Issue 1: "DATABASE_URL is not set"

**Solution:**
- Add `DATABASE_URL` environment variable in Vercel
- Redeploy

### Issue 2: "Cannot find module 'express'"

**Solution:**
- Check root `package.json` has dependencies (I created this)
- Redeploy with build cache OFF

### Issue 3: "MongoDB connection timeout"

**Solution:**
- Check MongoDB Atlas Network Access allows all IPs (0.0.0.0/0)
- Verify `DATABASE_URL` is correct
- Test connection locally: `cd backend && npm run test-db`

### Issue 4: "Function timeout"

**Solution:**
- Vercel free tier has 10-second timeout
- Database connection might be slow
- First request after inactivity (cold start) is slower

---

## 📊 What to Share for Help

If still not working, share:

1. **Error from Vercel logs** (most important!)
2. **Screenshot of Environment Variables** (hide passwords)
3. **Which endpoint fails** (`/`, `/api/health`, or `/graphql`)

---

## ✅ Quick Test

**Right now, do this:**

1. ✅ Check Vercel logs → **What error do you see?**
2. ✅ Check Environment Variables → **Are they set?**
3. ✅ Test `/api/health` → **Does it work?**

**Share the error from logs, and I'll help you fix it!** 🔍

---

## 🎯 Expected Results

After fixing:

- ✅ `/` → Returns API info
- ✅ `/api/health` → Returns `{"status":"OK"}`
- ✅ `/graphql` → Shows GraphQL Playground

If these work, your frontend can connect! 🎉

