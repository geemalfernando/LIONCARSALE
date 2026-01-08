# Fix .env.production File

## Problem
Your `.env.production` file contains placeholder/dummy data (`your-backend-url`), which is overriding the correct backend URL in the build.

## Solution

### Step 1: Update .env.production

Open the file: `frontend/.env.production`

**Replace all contents with:**

```
REACT_APP_GRAPHQL_URL=https://lioncarsa.vercel.app/graphql
REACT_APP_API_URL=https://lioncarsa.vercel.app
```

**OR delete the file entirely** - the source code has the correct defaults built-in.

### Step 2: Rebuild Frontend

After updating/deleting the file, rebuild:

```bash
cd frontend
npm run build
```

### Step 3: Deploy to Firebase

```bash
cd ..
firebase deploy --only hosting
```

## Quick Fix (Terminal Commands)

Run these commands in your terminal:

```bash
cd "/Users/geemalfernando/Documents/projects/LIon car sale/frontend"

# Option 1: Update the file with correct values
cat > .env.production << EOF
REACT_APP_GRAPHQL_URL=https://lioncarsa.vercel.app/graphql
REACT_APP_API_URL=https://lioncarsa.vercel.app
EOF

# Option 2: OR delete it (source code has defaults)
# rm .env.production

# Then rebuild
npm run build

# Deploy
cd ..
firebase deploy --only hosting
```

## Verify

After rebuilding, check the build contains the correct URL:

```bash
cd frontend/build/static/js
grep -r "lioncarsa.vercel.app" . || echo "Not found - check build"
```

