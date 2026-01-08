# Deploy to Firebase - Quick Steps

## ✅ Your Firebase Project
- **Project Name:** lion car
- **Project ID:** lion-car-9b4d6
- **Project Number:** 875117641141

## 🚀 Deploy Steps

### Step 1: Make sure you're logged in

```bash
firebase login
```

If you see a browser window, sign in with your Firebase account.

### Step 2: Set the project (already configured!)

The `.firebaserc` file is already set to use `lion-car-9b4d6`.

Verify it:
```bash
firebase use
```

Should show: `Now using project lion-car-9b4d6`

### Step 3: Build and Deploy

```bash
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

This will:
1. Build your React app
2. Deploy to Firebase Hosting
3. Show you the hosting URL

### Step 4: Get your hosting URL

After deployment, you'll see:
```
✅ Deploy complete!
Hosting URL: https://lion-car-9b4d6.web.app
```

Or check in Firebase Console:
- Go to: https://console.firebase.google.com/project/lion-car-9b4d6/hosting

## 📝 Important: Update Frontend URL

After deployment, you'll need to update:
1. Google Search Console verification (if needed)
2. Environment variables (if you have any)
3. Any hardcoded URLs in the code

## 🔄 One-Line Deploy Command

Run everything at once:

```bash
firebase use lion-car-9b4d6 && cd frontend && npm run build && cd .. && firebase deploy --only hosting
```

## ✅ What Gets Deployed

- ✅ React frontend (from `frontend/build`)
- ✅ `sitemap.xml` file
- ✅ `robots.txt` file
- ✅ All static assets (images, CSS, JS)

Your site will be live at: `https://lion-car-9b4d6.web.app`

