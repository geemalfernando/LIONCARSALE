# Backend URL Configuration

## Your Backend URLs

### Main Production URL (Recommended):
```
https://lioncarsa.vercel.app
```
This is your permanent production URL. Use this in your frontend.

### Preview Deployment URL:
```
https://lioncarsa-aduo3sont-geemal-fernandos-projects.vercel.app
```
This is a temporary preview URL that changes with each deployment. Don't use this in production.

## Current Frontend Configuration

Your frontend is currently configured to use:
```
https://lioncarsa.vercel.app
```
✅ This is correct!

## How to Check Your Main Production URL

1. Go to Vercel Dashboard
2. Select your project: `lioncarsa`
3. Look at the **"Domains"** section
4. Your main production URL should be: `lioncarsa.vercel.app`

## If Preview URL Works But Production Doesn't

If the preview URL works but the main URL doesn't:

1. **Check Domain Configuration** in Vercel
2. **Verify Production Deployment** is the latest
3. **Make sure production deployment is successful**

## Frontend Configuration

Your frontend code uses:
- **Production**: `https://lioncarsa.vercel.app` ✅
- **Development**: `http://localhost:5001` ✅

This is correct and should work!

## Test Your Backend URLs

### Test Production URL:
```bash
curl https://lioncarsa.vercel.app/api/health
```

### Test Preview URL:
```bash
curl https://lioncarsa-aduo3sont-geemal-fernandos-projects.vercel.app/api/health
```

Both should return the same response.

## If You Want to Use Preview URL (Not Recommended)

If you want to use the preview URL temporarily, update the frontend:

**File**: `frontend/src/utils/api.js`
**Change**:
```javascript
? 'https://lioncarsa-aduo3sont-geemal-fernandos-projects.vercel.app'
```

**But note**: This URL will change on the next deployment!

## Recommendation

✅ **Use the production URL**: `https://lioncarsa.vercel.app`
- It's permanent
- It won't change
- It's already configured in your frontend

❌ **Don't use preview URLs** in production:
- They change with each deployment
- They're temporary

## Summary

- **Backend Production URL**: `https://lioncarsa.vercel.app` ✅
- **Backend Preview URL**: `https://lioncarsa-aduo3sont-geemal-fernandos-projects.vercel.app` (temporary)
- **Frontend Configuration**: Already set to production URL ✅

Your frontend should already be working with the production backend URL!

