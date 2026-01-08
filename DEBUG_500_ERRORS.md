# Debugging 500 Errors

## Quick Check: Test Health Endpoint

First, test if the database is connected:

```bash
curl https://lioncarsa.vercel.app/api/health
```

### Expected Response (Good):
```json
{
  "status": "OK",
  "api": "REST API",
  "database": "MongoDB",
  "dbStatus": "connected"
}
```

### If dbStatus is "disconnected":
The database connection is failing. Check:
1. ✅ DATABASE_URL is set in Vercel
2. ✅ MongoDB Atlas Network Access allows 0.0.0.0/0
3. ✅ User has proper permissions

---

## Check Vercel Logs

### Steps:
1. Go to: https://vercel.com/dashboard
2. Select your project: `lioncarsa`
3. Click **"Deployments"** tab
4. Click the **latest deployment** (top one)
5. Click **"Logs"** tab
6. Look for error messages

### What to Look For:

**Good logs:**
```
🔌 Initializing database connection...
⏳ Connecting to MongoDB...
✅ MongoDB connected successfully
Database name: lion_car_sale
```

**Bad logs:**
```
❌ MongoDB connection error: ...
Database connection failed: ...
Vehicles route error: ...
```

---

## Common Issues & Fixes

### Issue 1: DATABASE_URL Not Set

**Error in logs:**
```
DATABASE_URL environment variable is not set
```

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Add: `DATABASE_URL` = `mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal`
3. Select: Production, Preview, Development
4. Save and Redeploy

---

### Issue 2: MongoDB Network Access

**Error in logs:**
```
MongoServerError: connection timeout
```

**Fix:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Save

---

### Issue 3: Database User Permissions

**Error in logs:**
```
not authorized on lion_car_sale
```

**Fix:**
1. Go to MongoDB Atlas → Database Access
2. Find user `geemal`
3. Edit user
4. Set privileges to: "Read and write to any database"
5. Save

---

### Issue 4: Database Name Missing

**Error in logs:**
```
Database connection failed
```

**Fix:**
Make sure DATABASE_URL includes database name:
```
mongodb+srv://.../lion_car_sale?appName=geemal
                              ^^^^^^^^^^^^
                              Database name required
```

---

## Quick Fix Checklist

- [ ] DATABASE_URL set in Vercel Environment Variables
- [ ] DATABASE_URL includes `/lion_car_sale` (database name)
- [ ] MongoDB Atlas Network Access allows 0.0.0.0/0
- [ ] MongoDB user `geemal` has "Read and write" permissions
- [ ] Vercel project redeployed after adding variables
- [ ] Health endpoint shows `"dbStatus": "connected"`

---

## Test After Fixes

```bash
# Test health
curl https://lioncarsa.vercel.app/api/health

# Test vehicles
curl https://lioncarsa.vercel.app/api/vehicles

# Test makes
curl https://lioncarsa.vercel.app/api/vehicles/filters/makes

# Test years
curl https://lioncarsa.vercel.app/api/vehicles/filters/years
```

All should return JSON with `"status": "OK"` and data.

---

## Still Getting 500 Errors?

1. **Check Vercel Logs** - Copy the full error message
2. **Test Health Endpoint** - See if database connects
3. **Verify Environment Variables** - Make sure DATABASE_URL is correct
4. **Check MongoDB Atlas** - Network Access and User Permissions

Share the error message from Vercel logs and we can fix it!

