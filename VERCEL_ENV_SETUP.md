# Vercel Environment Variables Setup

## MongoDB Connection String

Your MongoDB connection string should include the database name. 

### Current Connection String:
```
mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/?appName=geemal
```

### Corrected Connection String (with database name):
```
mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal
```

## How to Set Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project: `lion-car-sale` or `lioncarsa`

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** tab
   - Click on **Environment Variables** in the sidebar

3. **Add Environment Variables**

   Add these variables:
   
   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `DATABASE_URL` | `mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal` | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production |
   | `FRONTEND_URL` | `https://your-firebase-app.web.app` (optional) | Production |

4. **Redeploy**
   - After adding environment variables, Vercel will prompt you to redeploy
   - Click **Redeploy** or push a new commit to trigger a new deployment

## Important Notes

- The database name (`lion_car_sale`) is now automatically added if missing, but it's better to include it in the connection string
- Environment variables are encrypted and secure in Vercel
- You can have different values for Production, Preview, and Development environments
- After setting environment variables, you **must** redeploy for changes to take effect

## Verify Environment Variables

After redeploying, you can verify the environment variables are working by:
1. Checking the `/api/health` endpoint
2. Testing the `/graphql` endpoint
3. Viewing deployment logs in Vercel dashboard

