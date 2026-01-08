# Fix MongoDB SSL/TLS Connection Error

## Error
```
SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

This is a TLS/SSL handshake error when connecting to MongoDB Atlas.

## Fix Applied

### 1. Added SSL/TLS Options to Mongoose
Added explicit SSL/TLS configuration in `mongooseOptions`:
```javascript
tls: true,
ssl: true,
sslValidate: true,
```

### 2. Updated Connection String
The connection string now automatically includes TLS parameters:
- `tls=true`
- `retryWrites=true`
- `w=majority`

## Updated Environment Variable

Your `DATABASE_URL` should include TLS parameters:

**Current format**:
```
mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal
```

**Updated format (with TLS)**:
```
mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal&tls=true&retryWrites=true&w=majority
```

**Note**: The code will automatically add these if missing, but it's better to include them explicitly.

## Update Vercel Environment Variable

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Edit `DATABASE_URL`
3. Update to:
   ```
   mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal&tls=true&retryWrites=true&w=majority
   ```
4. Save and Redeploy

## Alternative: Check MongoDB Atlas Settings

If the error persists:

1. **Check MongoDB Atlas Network Access**
   - Go to MongoDB Atlas → Network Access
   - Make sure "Allow Access from Anywhere" (0.0.0.0/0) is enabled
   - Or add Vercel's IP ranges

2. **Check MongoDB Atlas Database User**
   - Go to MongoDB Atlas → Database Access
   - Verify user `geemal` has proper permissions
   - User should have "Read and write to any database" or at least access to `lion_car_sale`

3. **Verify Connection String**
   - Go to MongoDB Atlas → Connect → Drivers
   - Copy the connection string
   - Make sure it includes the database name: `/lion_car_sale`
   - Make sure SSL/TLS is enabled in Atlas (should be by default)

## Files Changed

- `backend/config/database.js`
  - Added SSL/TLS options
  - Updated connection string helper to include TLS parameters

## Next Steps

1. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Fix MongoDB SSL/TLS connection error"
   git push
   ```

2. **Update DATABASE_URL in Vercel** (with TLS parameters)

3. **Wait for deployment** (~1-2 minutes)

4. **Test connection**:
   - Visit: `https://lioncarsa.vercel.app/api/health`
   - Should show: `"dbStatus": "connected"`

The SSL/TLS error should be resolved! ✅

