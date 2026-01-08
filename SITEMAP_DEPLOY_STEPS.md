# Fix "Couldn't Fetch" Sitemap Error

## Problem
Your sitemap shows "Couldn't fetch" because the `sitemap.xml` file doesn't exist on the server yet.

## Solution: Generate and Deploy

### Step 1: Generate Sitemap File

Run this command from your project root:

```bash
node generate-sitemap.js
```

**Expected output:**
```
🔄 Generating sitemap...
   Backend: https://lioncarsa.vercel.app
   Frontend: https://auditra-web.web.app
   Found X vehicles
✅ Sitemap generated successfully!
   File: frontend/public/sitemap.xml
   Total URLs: X (X vehicles + 1 homepage)
```

This creates: `frontend/public/sitemap.xml`

### Step 2: Build Frontend

The build process copies files from `public/` to `build/`:

```bash
cd frontend
npm run build
cd ..
```

This will copy `sitemap.xml` from `public/` to `build/`.

### Step 3: Verify Sitemap Exists

Check that the file is in the build directory:

```bash
ls -la frontend/build/sitemap.xml
```

Should show the file exists.

### Step 4: Deploy to Firebase

```bash
firebase deploy --only hosting
```

### Step 5: Test Sitemap

After deployment, visit:
```
https://auditra-web.web.app/sitemap.xml
```

You should see XML content with all your vehicle URLs.

### Step 6: Re-submit in Google Search Console

1. Go to Google Search Console → Sitemaps
2. Click the three dots (⋮) next to the failed sitemap
3. Click "Delete" or just wait - Google will automatically re-crawl
4. Or manually re-request indexing using the URL Inspection tool

## Quick One-Line Command

Run all steps at once:

```bash
node generate-sitemap.js && cd frontend && npm run build && cd .. && firebase deploy --only hosting
```

## Troubleshooting

### If "Couldn't fetch" persists:

1. **Check file exists:**
   ```bash
   cat frontend/build/sitemap.xml
   ```
   Should show XML content.

2. **Check Firebase config:**
   Your `firebase.json` should have the rewrite rule (already added ✅)

3. **Check file is accessible:**
   Visit `https://auditra-web.web.app/sitemap.xml` in your browser
   - Should show XML (not HTML error page)
   - Should have correct Content-Type: `application/xml`

4. **Check robots.txt:**
   Visit `https://auditra-web.web.app/robots.txt`
   Should reference the sitemap

### Common Issues:

- **File not in build/**: Make sure `npm run build` ran after generating sitemap
- **Wrong Content-Type**: Check `firebase.json` headers (already configured ✅)
- **Caching**: Clear browser cache or use incognito mode
- **Firebase cache**: Wait 5-10 minutes after deployment for Firebase CDN to update

## Update Sitemap Regularly

Every time you add new vehicles, regenerate:

```bash
node generate-sitemap.js
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

Or automate this with GitHub Actions or a cron job.

