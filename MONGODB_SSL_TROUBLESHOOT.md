# MongoDB SSL/TLS Error Troubleshooting

## Error
```
SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

## Solution

### For `mongodb+srv://` URLs (MongoDB Atlas)
- **TLS is automatically enabled** - no need to add `tls=true`
- Mongoose handles TLS automatically for `mongodb+srv://` connections

### Updated Connection String

Your `DATABASE_URL` in Vercel should be:
```
mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal&retryWrites=true&w=majority
```

**Note**: The code automatically adds `retryWrites=true&w=majority` if missing.

## Common Causes & Fixes

### 1. MongoDB Atlas Network Access
**Check**: Go to MongoDB Atlas → Network Access

**Fix**:
- Enable "Allow Access from Anywhere" (0.0.0.0/0)
- OR add Vercel's IP ranges (though 0.0.0.0/0 is easier)

### 2. Database User Permissions
**Check**: Go to MongoDB Atlas → Database Access

**Fix**:
- User `geemal` should have "Read and write to any database"
- OR at least "Read and write" to `lion_car_sale` database

### 3. Connection String Format
**Required format**:
```
mongodb+srv://username:password@cluster.mongodb.net/database_name?appName=appname&retryWrites=true&w=majority
```

**Important**:
- Include database name: `/lion_car_sale`
- Use `mongodb+srv://` (not `mongodb://`)
- Don't add `tls=true` (it's automatic for mongodb+srv)

### 4. Node.js Version
**Check**: Vercel might be using an older Node.js version

**Fix**: Add to `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Verify Vercel Environment Variable

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify `DATABASE_URL` is:
   ```
   mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal
   ```
3. Make sure there are **no extra spaces** or **line breaks**
4. Redeploy after changing

## Test Connection

After fixing, test:
```bash
curl https://lioncarsa.vercel.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "dbStatus": "connected"
}
```

## If Error Persists

1. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Deployments → Latest → Logs
   - Look for MongoDB connection messages
   - Check for specific error details

2. **Try Fresh Connection String**:
   - Go to MongoDB Atlas → Connect → Drivers
   - Copy the connection string
   - Replace username/password with your credentials
   - Add database name: `/lion_car_sale`
   - Use this in Vercel

3. **Check MongoDB Atlas Status**:
   - Verify your cluster is running
   - Check if there are any Atlas service issues

## Files Updated

- `backend/config/database.js` - Removed redundant TLS configuration (auto-handled for mongodb+srv)

## Summary

✅ **For `mongodb+srv://`**: TLS is automatic - no need to configure  
✅ **Check Network Access**: Must allow 0.0.0.0/0 or Vercel IPs  
✅ **Check User Permissions**: User must have database access  
✅ **Connection String**: Must include database name `/lion_car_sale`

