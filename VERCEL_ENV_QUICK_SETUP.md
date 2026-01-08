# Vercel Environment Variables - Quick Setup

## 📋 Copy-Paste Values for Vercel Dashboard

### 1. DATABASE_URL (REQUIRED)

**Key**: `DATABASE_URL`

**Value** (copy entire line):
```
mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal
```

**Environment**: ✅ Production ✅ Preview ✅ Development

---

### 2. NODE_ENV (Recommended)

**Key**: `NODE_ENV`

**Value**:
```
production
```

**Environment**: ✅ Production only

---

### 3. FRONTEND_URL (Optional - for CORS)

**Key**: `FRONTEND_URL`

**Value**:
```
https://auditra-web.web.app
```

**Environment**: ✅ Production only

---

## 🚀 How to Add in Vercel

1. Go to: https://vercel.com/dashboard
2. Click your project: `lioncarsa`
3. Click **Settings** tab
4. Click **Environment Variables** (left sidebar)
5. For each variable:
   - Click **Add New**
   - Paste the **Key** and **Value** from above
   - Select the **Environment(s)**
   - Click **Save**
6. **Redeploy** your project (Vercel will prompt you)

---

## ✅ Quick Checklist

- [ ] DATABASE_URL added (all environments)
- [ ] NODE_ENV added (Production only)
- [ ] FRONTEND_URL added (Production only - optional)
- [ ] Project redeployed

---

## 📝 All in One (For Reference)

```
DATABASE_URL=mongodb+srv://geemal:Fernando1976@geemal.z9d7ccy.mongodb.net/lion_car_sale?appName=geemal
NODE_ENV=production
FRONTEND_URL=https://auditra-web.web.app
```

**Remember**: Add these in Vercel Dashboard, not as a .env file!

