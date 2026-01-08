# 🔧 Vercel Serverless Function Troubleshooting

## ⚠️ Common Error: 500 INTERNAL_SERVER_ERROR / FUNCTION_INVOCATION_FAILED

If you're getting this error, follow these steps:

---

## ✅ Step 1: Check Environment Variables in Vercel

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com
   - Select your project
   - Go to **"Settings"** → **"Environment Variables"**

2. **Verify these variables are set:**
   ```
   DATABASE_URL=mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?retryWrites=true&w=majority&appName=geemal
   NODE_ENV=production
   FRONTEND_URL=https://auditra-web.web.app
   ```

3. **Make sure they're set for:**
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

4. **Redeploy after adding variables:**
   - Go to **"Deployments"**
   - Click **"Redeploy"** on latest deployment

---

## ✅ Step 2: Check Deployment Logs

1. **In Vercel Dashboard:**
   - Go to **"Deployments"**
   - Click on the latest deployment
   - Click **"Logs"** tab

2. **Look for errors:**
   - Database connection errors
   - Missing dependencies
   - Module not found errors

---

## ✅ Step 3: Verify Dependencies

Vercel needs to install backend dependencies. Make sure:

1. **Root `package.json` exists** (I created this for you)
2. **Or backend dependencies are accessible**

The root `package.json` I created includes all backend dependencies.

---

## ✅ Step 4: Test Health Endpoint

After deployment, test these endpoints:

1. **Root:** `https://your-app.vercel.app/`
   - Should return API info

2. **Health:** `https://your-app.vercel.app/api/health`
   - Should return `{"status":"OK",...}`

3. **GraphQL:** `https://your-app.vercel.app/graphql`
   - Should show GraphQL Playground

---

## 🔍 Common Issues & Solutions

### Issue 1: "Cannot find module"

**Solution:**
- Check if `package.json` at root has all dependencies
- Make sure `vercel.json` includes backend files
- Redeploy after adding dependencies

### Issue 2: "Database connection failed"

**Solution:**
- Verify `DATABASE_URL` in Vercel environment variables
- Make sure MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Check MongoDB Atlas Network Access settings

### Issue 3: "Apollo Server initialization failed"

**Solution:**
- Check deployment logs for specific error
- Verify GraphQL schema and resolvers are correct
- Make sure all required modules are in `package.json`

### Issue 4: Cold start timeout

**Solution:**
- First request after inactivity may be slow (cold start)
- Vercel free tier has 10-second timeout
- Make database connection non-blocking (already done in code)

---

## 📝 Quick Checklist

Before redeploying, make sure:

- ✅ `DATABASE_URL` is set in Vercel environment variables
- ✅ `NODE_ENV=production` is set
- ✅ `FRONTEND_URL` is set (your Firebase URL)
- ✅ Root `package.json` exists with backend dependencies
- ✅ `vercel.json` points to `api/index.js`
- ✅ All files are committed and pushed to GitHub

---

## 🚀 After Fixing

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Fix Vercel serverless function errors"
   git push
   ```

2. **Vercel will auto-deploy** (or manually redeploy)

3. **Test endpoints:**
   - `/` - Should work
   - `/api/health` - Should work
   - `/graphql` - Should show playground

---

## 💡 Still Not Working?

If you're still getting errors:

1. **Check Vercel logs** - Most important step!
2. **Test locally** - Make sure backend works locally first:
   ```bash
   cd backend
   npm install
   npm start
   ```
3. **Verify MongoDB connection** - Test locally:
   ```bash
   cd backend
   npm run test-db
   ```

---

## ✅ Summary

The most common issues are:
1. Missing environment variables (especially `DATABASE_URL`)
2. Dependencies not installed correctly
3. Database connection errors

Check Vercel logs first - they'll tell you exactly what's wrong!

Good luck! 🚀

