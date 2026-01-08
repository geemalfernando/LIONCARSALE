# Quick Fix for Firebase Deployment

## Issue: "An unexpected error has occurred"

I've fixed the `firebase.json` file (removed unused functions config).

## Step 1: Enable Hosting in Firebase Console

**This is the most important step!**

1. Go to: https://console.firebase.google.com/project/lion-car-9b4d6/hosting
2. Click **"Get started"** or **"Add site"**
3. Follow the setup wizard
4. This enables Hosting for your project

## Step 2: Try Deploy Again

After enabling hosting, run:

```bash
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

## Alternative: Get More Details

To see the full error message:

```bash
firebase deploy --only hosting --debug 2>&1 | tee deploy-error.log
```

Then check `deploy-error.log` for details.

## Most Common Cause

The error usually means:
- ✅ Hosting not enabled in Firebase Console (most likely)
- ✅ You need to enable it first before deploying

## After Enabling Hosting

Once hosting is enabled in the console, this command should work:

```bash
firebase use lion-car-9b4d6 && cd frontend && npm run build && cd .. && firebase deploy --only hosting
```

## What Changed

✅ Removed `functions` section from `firebase.json` (we're only using hosting)
✅ Keeping hosting configuration intact

Now enable hosting in the console and try deploying again!

