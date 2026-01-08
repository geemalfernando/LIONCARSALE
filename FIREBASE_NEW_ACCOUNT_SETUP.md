# Firebase Setup - New Account

## Step 1: Login to Firebase CLI

Run this command to login:

```bash
firebase login
```

This will open a browser window. Sign in with your new Firebase account.

## Step 2: List Your Projects

After logging in, check what projects you have:

```bash
firebase projects:list
```

You should see your "lion car" project (ID: `lion-car-9b4d6`)

## Step 3: Use Existing Project OR Create New

### Option A: Use Existing Project "lion car"

If you want to use the existing "lion car" project:

```bash
firebase use lion-car-9b4d6
```

### Option B: Create New Project

If you want to create a new project:

1. Go to Firebase Console: https://console.firebase.google.com
2. Click "Create a new Firebase project" (or "Add project")
3. Enter project name (e.g., "lion-car-sale")
4. Follow the setup wizard
5. Copy the project ID

Then use it:
```bash
firebase use YOUR_PROJECT_ID
```

## Step 4: Initialize Hosting (If Not Already Done)

```bash
firebase init hosting
```

When prompted:
- **What do you want to use as your public directory?** → `frontend/build`
- **Configure as a single-page app?** → `Yes`
- **Set up automatic builds and deploys with GitHub?** → `No` (or Yes if you want)

## Step 5: Update .firebaserc

The `.firebaserc` file should be automatically updated, but if needed, edit it:

```json
{
  "projects": {
    "default": "lion-car-9b4d6"
  }
}
```

Replace `lion-car-9b4d6` with your actual project ID.

## Step 6: Deploy

```bash
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

## Quick One-Line Setup

If you want to use the existing "lion car" project:

```bash
firebase use lion-car-9b4d6 && cd frontend && npm run build && cd .. && firebase deploy --only hosting
```

