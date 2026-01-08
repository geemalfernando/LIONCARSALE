# Vercel Environment Variables Setup

## Required Environment Variables

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these variables:

### 1. DATABASE_URL (REQUIRED)

**Key**: `DATABASE_URL`

**Value**: 
```
mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal
```

**Environment**: Select all (Production, Preview, Development)

---

### 2. NODE_ENV (Recommended)

**Key**: `NODE_ENV`

**Value**: 
```
production
```

**Environment**: Production only

---

### 3. FRONTEND_URL (Optional - for CORS)

**Key**: `FRONTEND_URL`

**Value**: 
```
https://auditra-web.web.app
```

**Environment**: Production only

---

## Step-by-Step Instructions

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `lioncarsa` or your project name

2. **Navigate to Settings**
   - Click on your project
   - Click **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add DATABASE_URL**
   - Click **Add New**
   - **Key**: `DATABASE_URL`
   - **Value**: `mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal`
   - **Environment**: Select **Production**, **Preview**, and **Development** (or just Production)
   - Click **Save**

4. **Add NODE_ENV** (Optional)
   - Click **Add New**
   - **Key**: `NODE_ENV`
   - **Value**: `production`
   - **Environment**: **Production** only
   - Click **Save**

5. **Redeploy**
   - After adding variables, Vercel will prompt you to **Redeploy**
   - Click **Redeploy** or push a new commit to trigger deployment

---

## Verify Environment Variables

After redeploying, check if variables are set:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Logs**
4. Look for: `🔌 Connecting to MongoDB...`
5. Should see: `✅ MongoDB connected successfully`

---

## Troubleshooting

### Error: "DATABASE_URL environment variable is not set"
- Make sure you added the variable in Vercel
- Make sure you selected the correct environment (Production, Preview, Development)
- Redeploy after adding variables

### Error: "Database connection failed"
- Verify the connection string is correct
- Check MongoDB Atlas Network Access (should allow 0.0.0.0/0)
- Check MongoDB Atlas Database Access (user should have read/write permissions)
- Make sure database name is in the connection string: `/lion_car_sale`

### Error: "buffermaxentries is not supported"
- ✅ Fixed! This option has been removed from the code

---

## Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/database_name?appName=appname
```

**Important**: 
- Include the database name: `/lion_car_sale`
- Keep the `?appName=geemal` part
- No spaces in the connection string

---

## Quick Copy-Paste for Vercel

### DATABASE_URL
```
Key: DATABASE_URL
Value: mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal
Environment: Production, Preview, Development
```

### NODE_ENV (Optional)
```
Key: NODE_ENV
Value: production
Environment: Production
```

---

## Summary

✅ **Required**: `DATABASE_URL` - MongoDB connection string  
✅ **Optional**: `NODE_ENV` - Set to `production`  
✅ **Optional**: `FRONTEND_URL` - Your Firebase hosting URL  

After adding these and redeploying, your backend should connect to MongoDB successfully!

