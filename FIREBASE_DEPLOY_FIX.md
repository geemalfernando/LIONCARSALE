# Fix Firebase Deployment Error

## Error: "An unexpected error has occurred"

This usually means Firebase Hosting isn't enabled or there's a permission issue.

## Step-by-Step Fix

### Step 1: Enable Firebase Hosting in Console

1. Go to Firebase Console: https://console.firebase.google.com/project/lion-car-9b4d6
2. Click "Hosting" in the left menu
3. Click "Get started" or "Add site"
4. Follow the setup wizard
5. This will enable Hosting for your project

### Step 2: Verify Firebase CLI Login

Make sure you're logged in with the correct account:

```bash
firebase login
firebase logout  # If needed, logout first
firebase login   # Login again
```

### Step 3: Verify Project Access

Check if you can access the project:

```bash
firebase projects:list
```

Should show `lion-car-9b4d6` in the list.

### Step 4: Initialize Hosting (If Not Already Done)

If hosting isn't initialized, run:

```bash
firebase init hosting
```

When prompted:
- **What do you want to use as your public directory?** → `frontend/build`
- **Configure as a single-page app?** → `Yes`
- **Set up automatic builds and deploys with GitHub?** → `No` (unless you want this)
- **File frontend/build/index.html already exists. Overwrite?** → `No`

### Step 5: Try Deploy Again

After enabling hosting in the console:

```bash
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

## Alternative: Manual Deployment via Console

If CLI deployment keeps failing:

1. Go to Firebase Console → Hosting
2. Click "Get started" if needed
3. After hosting is enabled, you can:
   - Drag and drop your `frontend/build` folder
   - Or use the CLI command shown in the console

## Check for Detailed Error

To see the full error message:

```bash
firebase deploy --only hosting --debug
```

This will show more details about what's failing.

## Common Issues

1. **Hosting not enabled**: Must enable in Firebase Console first
2. **Wrong account**: Make sure you're logged in with the account that owns the project
3. **Permissions**: You need "Editor" or "Owner" role on the project
4. **Build folder missing**: Make sure `frontend/build` exists

## Quick Test

Test if the project is accessible:

```bash
firebase use
```

Should show: `Now using project lion-car-9b4d6 (alias: default)`

## After Enabling Hosting

Once hosting is enabled in the console, deployment should work:

```bash
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

