# 🚀 Vercel Backend + Firebase Frontend Setup Guide

This guide shows you how to deploy your backend to Vercel and frontend to Firebase with MongoDB.

---

## 📋 Prerequisites

- ✅ GitHub account (free)
- ✅ MongoDB Atlas account (free)
- ✅ Firebase account (free)
- ✅ Vercel account (free, no card required)

---

## 🎯 Step 1: Deploy Backend to Vercel

### Step 1.1: Prepare Your Code

Your backend is already configured for Vercel! The `vercel.json` file is set up.

### Step 1.2: Deploy to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
   - Click **"Sign Up"** → Sign in with **GitHub** (FREE, NO CARD REQUIRED)

2. **Import Project:**
   - Click **"Add New..."** → **"Project"**
   - Import your GitHub repository
   - Select your repository

3. **Configure Project:**
   - **Framework Preset**: Other (or leave default)
   - **Root Directory**: Leave as `/` (root)
   - **Build Command**: Leave empty (or `cd backend && npm install`)
   - **Output Directory**: Leave empty
   - **Install Command**: Leave empty (or `cd backend && npm install`)

4. **Add Environment Variables:**
   - Scroll to **"Environment Variables"** section
   - Click **"Add"** for each variable:
     ```
     DATABASE_URL=mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?retryWrites=true&w=majority&appName=geemal
     NODE_ENV=production
     FRONTEND_URL=https://auditra-web.web.app
     ```
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

5. **Deploy:**
   - Click **"Deploy"**
   - Wait 2-3 minutes for deployment
   - Once deployed, **copy your Vercel URL** (e.g., `https://your-app.vercel.app`)

6. **Get Your Backend URL:**
   - Your GraphQL endpoint will be: `https://your-app.vercel.app/graphql`
   - Health check: `https://your-app.vercel.app/api/health`

**✅ Your backend is now live on Vercel!**

---

## 🎯 Step 2: Update Frontend Configuration

### Step 2.1: Create Environment Variables File

1. **Create `frontend/.env.production`:**
   ```bash
   cd frontend
   ```

   Create `.env.production` file:
   ```env
   REACT_APP_GRAPHQL_URL=https://your-app.vercel.app/graphql
   REACT_APP_API_URL=https://your-app.vercel.app
   ```
   
   **Replace `your-app.vercel.app` with your actual Vercel URL!**

2. **Also create `.env.development` for local testing:**
   ```env
   REACT_APP_GRAPHQL_URL=http://localhost:5001/graphql
   REACT_APP_API_URL=http://localhost:5001
   ```

### Step 2.2: Rebuild Frontend

```bash
cd frontend
npm run build
cd ..
```

---

## 🎯 Step 3: Deploy Frontend to Firebase

```bash
firebase deploy --only hosting
```

**✅ Your frontend is now live on Firebase!**

---

## ✅ Test Your Deployment

1. **Test Backend (Vercel):**
   - Visit: `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"OK",...}`
   - Visit: `https://your-app.vercel.app/graphql`
   - Should show GraphQL Playground

2. **Test Frontend (Firebase):**
   - Visit: `https://auditra-web.web.app`
   - Check browser console for any errors
   - Verify vehicles are loading from MongoDB

---

## 🔧 Troubleshooting

### Backend Not Starting on Vercel

**Check Vercel Deployment Logs:**
1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"** → Click on latest deployment
3. Check **"Logs"** tab for errors

**Common Issues:**
- **Missing Environment Variables**: Make sure `DATABASE_URL` is set
- **Build Errors**: Check if all dependencies are in `package.json`
- **Timeout Errors**: Vercel has cold starts - first request may be slow

### Frontend Can't Connect to Backend

**Check:**
1. Verify `REACT_APP_GRAPHQL_URL` in `.env.production` is correct
2. Rebuild frontend after changing `.env.production`
3. Check browser console for CORS errors
4. Make sure `FRONTEND_URL` in Vercel matches your Firebase URL

### MongoDB Connection Issues

**Check:**
1. Verify `DATABASE_URL` in Vercel environment variables
2. Make sure MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
3. Test MongoDB connection locally first

---

## 📝 Environment Variables Summary

### Vercel (Backend):
```
DATABASE_URL=mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?retryWrites=true&w=majority&appName=geemal
NODE_ENV=production
FRONTEND_URL=https://auditra-web.web.app
```

### Frontend (`.env.production`):
```
REACT_APP_GRAPHQL_URL=https://your-app.vercel.app/graphql
REACT_APP_API_URL=https://your-app.vercel.app
```

---

## 🎯 Quick Reference

**Backend (Vercel):**
- URL: `https://your-app.vercel.app`
- GraphQL: `https://your-app.vercel.app/graphql`
- Health: `https://your-app.vercel.app/api/health`

**Frontend (Firebase):**
- URL: `https://auditra-web.web.app`

**Database (MongoDB Atlas):**
- Connection: Already configured in Vercel `DATABASE_URL`

---

## ✅ Summary

1. ✅ **Deploy backend to Vercel** (5 min, free, no card)
   - Import GitHub repo
   - Add environment variables
   - Deploy

2. ✅ **Get Vercel backend URL**
   - Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

3. ✅ **Update frontend `.env.production`**
   - Add Vercel GraphQL URL
   - Rebuild frontend

4. ✅ **Deploy frontend to Firebase**
   - `firebase deploy --only hosting`

**Result:**
- ✅ Backend: Vercel (free, serverless)
- ✅ Frontend: Firebase Hosting (free)
- ✅ Database: MongoDB Atlas (free)
- ✅ **Total Cost: $0/month** 🎉

---

## 🚀 Next Steps

1. Deploy backend to Vercel → Get URL
2. Update frontend `.env.production` → Rebuild
3. Deploy frontend to Firebase
4. Test everything works
5. Enjoy your deployed app! 🎉

Good luck! 🚀

