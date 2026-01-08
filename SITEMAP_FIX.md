# Fix: Sitemap Must Be on Same Domain

## The Problem
Google Search Console rejected your sitemap because it's on a different domain:
- ❌ Your site: `auditra-web.web.app` (Firebase)
- ❌ Sitemap was: `lioncarsa.vercel.app/sitemap.xml` (Vercel - different domain!)

**Google requires sitemaps to be on the SAME domain as your verified property.**

## Solution: Generate Sitemap on Your Domain

### Step 1: Generate the Sitemap File

Run this command in your terminal (from the project root):

```bash
node generate-sitemap.js
```

This will:
- Fetch all vehicles from your backend
- Create `frontend/public/sitemap.xml`
- The sitemap will be on YOUR domain: `auditra-web.web.app/sitemap.xml`

### Step 2: Build and Deploy

```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

### Step 3: Test the Sitemap

After deployment, visit:
```
https://auditra-web.web.app/sitemap.xml
```

You should see XML with all your vehicle URLs.

### Step 4: Submit to Google

1. Go to Google Search Console
2. Click "Sitemaps" (left menu)
3. Enter: `sitemap.xml` (or `https://auditra-web.web.app/sitemap.xml`)
4. Click "SUBMIT"

✅ Now it will work because it's on the same domain!

## Alternative: Manual Generation

If the script doesn't work:

1. Visit: `https://lioncarsa.vercel.app/api/vehicles`
2. Copy the JSON response
3. Create `frontend/public/sitemap.xml` manually using this template:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>shttps://auditra-web.web.app/</loc>
    <lastmod>2026-01-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Add vehicle URLs here -->
  <url>
    <loc>https://auditra-web.web.app/vehicle/YOUR_VEHICLE_ID</loc>
    <lastmod>2026-01-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## Update Sitemap Regularly

Every time you add new vehicles, regenerate and redeploy:

```bash
node generate-sitemap.js
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

Or set up automatic updates using GitHub Actions or a cron job.

