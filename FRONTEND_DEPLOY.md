# 🚀 Deploy Frontend to Firebase Hosting

## Quick Deploy Steps

### Step 1: Build Frontend
```bash
cd frontend
npm run build
cd ..
```

### Step 2: Deploy to Firebase
```bash
firebase deploy --only hosting
```

That's it! ✅

---

## Detailed Instructions

### Prerequisites
1. **Firebase CLI installed**: If not, install it:
   ```bash
   npm install -g firebase-tools
   ```

2. **Logged in to Firebase**: 
   ```bash
   firebase login
   ```

3. **Firebase project initialized**: Should already be done (you have `firebase.json`)

### Full Deployment Process

#### Option 1: Manual Deploy (Recommended)

1. **Navigate to project root**:
   ```bash
   cd "/Users/geemalfernando/Documents/projects/LIon car sale"
   ```

2. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```
   This creates the production build in `frontend/build/`

3. **Deploy to Firebase**:
   ```bash
   firebase deploy --only hosting
   ```

4. **Done!** 🎉
   - Firebase will show you the deployment URL
   - Usually: `https://your-project-id.web.app` or `https://your-project-id.firebaseapp.com`

#### Option 2: One-Line Deploy

From project root:
```bash
cd frontend && npm run build && cd .. && firebase deploy --only hosting
```

#### Option 3: Use Deploy Script

Run the existing deploy script:
```bash
chmod +x deploy-firebase.sh
./deploy-firebase.sh
```

---

## What Gets Deployed

Firebase Hosting serves files from:
- **Directory**: `frontend/build/` (configured in `firebase.json`)
- **Files**: All static files from the React build
- **Entry point**: `frontend/build/index.html`

---

## Firebase Configuration

Your `firebase.json` is already configured:
```json
{
  "hosting": {
    "public": "frontend/build",
    ...
  }
}
```

---

## Environment Variables

Make sure your frontend `.env.production` (if you created it) or the code defaults are set correctly:

**Current defaults in code:**
- REST API URL: `https://lioncarsa.vercel.app` (production)
- Health check: `https://lioncarsa.vercel.app/api/health`

These are already set in:
- `frontend/src/utils/api.js`
- `frontend/src/components/PhotoGallery.js`
- `frontend/src/components/VehicleForm.js`
- `frontend/src/components/VehicleCard.js`

---

## Verify Deployment

After deployment:

1. **Visit your Firebase URL**
   - Check the URL shown after `firebase deploy`
   - Usually: `https://your-project-id.web.app`

2. **Test the app**:
   - ✅ Homepage loads
   - ✅ Vehicles list displays
   - ✅ Search/filters work
   - ✅ Vehicle detail pages work
   - ✅ Admin panel works (password: `LionCar2024!`)

3. **Check browser console**:
   - Open DevTools (F12)
   - Check Network tab
   - Verify API calls go to: `https://lioncarsa.vercel.app/api/vehicles`

---

## Troubleshooting

### Build Fails
```bash
# Make sure you're in frontend directory
cd frontend

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Deploy Fails
```bash
# Check Firebase login
firebase login

# Check Firebase project
firebase projects:list

# Check current project
firebase use

# Switch project if needed
firebase use your-project-id
```

### 404 Errors After Deploy
- Check `firebase.json` has correct `public` directory
- Make sure `frontend/build/index.html` exists
- Firebase should automatically rewrite all routes to `index.html`

### API Calls Fail
- Verify backend is deployed on Vercel: `https://lioncarsa.vercel.app/api/health`
- Check browser console for CORS errors
- Verify `REACT_APP_API_URL` in production build

---

## Update Frontend After Changes

Every time you change frontend code:

1. **Rebuild**:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

2. **Redeploy**:
   ```bash
   firebase deploy --only hosting
   ```

---

## Firebase Hosting Commands

```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy with preview channel
firebase hosting:channel:deploy preview

# List all deployments
firebase hosting:clone <sourceSiteId> <targetSiteId>

# View deployment history
firebase hosting:channel:list

# Rollback to previous deployment
firebase hosting:rollback
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Build frontend | `cd frontend && npm run build && cd ..` |
| Deploy to Firebase | `firebase deploy --only hosting` |
| Check Firebase login | `firebase login` |
| Check current project | `firebase use` |
| View Firebase projects | `firebase projects:list` |

---

## Summary

**To deploy frontend only:**

```bash
# 1. Build
cd frontend && npm run build && cd ..

# 2. Deploy
firebase deploy --only hosting
```

**That's it!** Your frontend will be live on Firebase Hosting and will connect to your Vercel backend at `https://lioncarsa.vercel.app`

