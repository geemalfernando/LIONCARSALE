# 🚀 MongoDB Deployment Guide - Lion Car Sale

This guide explains how to deploy your Lion Car Sale app with MongoDB backend.

## ⚠️ Important: You Need to Deploy BOTH Frontend AND Backend

Firebase only hosts your frontend. You need to deploy your backend separately so the frontend can fetch data from MongoDB.

---

## Step 1: Deploy Backend to Render (Free)

1. **Go to [Render.com](https://render.com)** and sign up (free, no credit card)

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (push your code first if needed)
   - Select the repository

3. **Configure Service:**
   - **Name**: `lion-car-sale-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add Environment Variables:**
   - `DATABASE_URL`: `mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?retryWrites=true&w=majority&appName=geemal`
   - `NODE_ENV`: `production`
   - `PORT`: `5001` (or leave blank, Render will assign automatically)
   - `FRONTEND_URL`: Your Firebase frontend URL (e.g., `https://auditra-web.web.app`)

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - **Copy your backend URL** (e.g., `https://lion-car-sale-backend.onrender.com`)

---

## Step 2: Update Frontend Environment Variables

1. **Create `.env` file in `frontend` directory:**

   ```bash
   cd frontend
   ```

   Create `.env` file with:
   ```env
   REACT_APP_GRAPHQL_URL=https://your-backend-url.onrender.com/graphql
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

   **Replace `https://your-backend-url.onrender.com` with your actual Render backend URL!**

2. **Rebuild Frontend:**
   ```bash
   npm run build
   ```

---

## Step 3: Deploy Frontend to Firebase

1. **Deploy:**
   ```bash
   cd ..
   ./deploy-firebase.sh
   ```

   Or manually:
   ```bash
   cd frontend
   npm run build
   cd ..
   firebase deploy --only hosting
   ```

---

## Step 4: Verify Everything Works

1. **Visit your Firebase URL** (e.g., `https://auditra-web.web.app`)
2. **Check browser console** for any errors
3. **Verify vehicles are loading** from MongoDB

---

## Troubleshooting

### Vehicles Not Loading?

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Common error: `CORS` or `Network Error`

2. **Check Backend Logs on Render:**
   - Go to Render dashboard
   - Click on your backend service
   - Check "Logs" tab for errors

3. **Verify Environment Variables:**
   - Make sure `.env` file in `frontend` has correct backend URL
   - Rebuild frontend after changing `.env`

4. **Check CORS Settings:**
   - In `backend/server.js`, make sure `FRONTEND_URL` includes your Firebase URL
   - Update `FRONTEND_URL` in Render environment variables

### Backend Not Starting?

1. **Check MongoDB Connection:**
   - Verify `DATABASE_URL` in Render environment variables
   - Test connection locally with `npm run test-db`

2. **Check Build Logs:**
   - Look for errors in Render build logs
   - Make sure all dependencies are installed

---

## Alternative: Deploy Backend to Railway

If Render doesn't work, you can use Railway:

1. **Go to [Railway.app](https://railway.app)** and sign up
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Add Environment Variables** (same as Render)
5. **Railway will auto-detect** the backend directory
6. **Get your Railway URL** and use it in frontend `.env`

---

## Quick Reference

**Backend URL Format:**
```
https://your-service-name.onrender.com/graphql
```

**Frontend .env File:**
```env
REACT_APP_GRAPHQL_URL=https://your-backend-url.onrender.com/graphql
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

**Backend Environment Variables:**
- `DATABASE_URL`: Your MongoDB connection string
- `FRONTEND_URL`: Your Firebase frontend URL
- `NODE_ENV`: `production`

---

## Summary

✅ **Backend**: Deploy to Render/Railway with MongoDB connection  
✅ **Frontend**: Create `.env` with backend URL → Rebuild → Deploy to Firebase  
✅ **Test**: Visit Firebase URL and verify vehicles load from MongoDB

Good luck! 🚀

