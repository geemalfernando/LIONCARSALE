# Generate Sitemap for Firebase Hosting

## Problem
Google Search Console requires sitemaps to be on the same domain. Since your site is on `auditra-web.web.app` (Firebase) but your sitemap was on `lioncarsa.vercel.app` (Vercel), Google rejected it.

## Solution: Create Sitemap on Frontend Domain

We'll create a script that generates the sitemap dynamically on your Firebase domain.

### Option 1: Generate Static Sitemap (Recommended)

Run this script to generate a static sitemap.xml file:

```bash
# Create a script to generate sitemap
cat > generate-sitemap.js << 'EOF'
const https = require('https');
const fs = require('fs');

const backendUrl = 'https://lioncarsa.vercel.app';
const baseUrl = 'https://auditra-web.web.app';
const outputFile = 'frontend/public/sitemap.xml';

https.get(`${backendUrl}/api/vehicles`, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      const vehicles = response.data || [];
      const currentDate = new Date().toISOString().split('T')[0];
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Vehicle listings -->
${vehicles.map(vehicle => {
  const vehicleDate = vehicle.updatedAt 
    ? new Date(vehicle.updatedAt).toISOString().split('T')[0]
    : currentDate;
  const vehicleId = vehicle.id || vehicle._id;
  return `  <url>
    <loc>${baseUrl}/vehicle/${vehicleId}</loc>
    <lastmod>${vehicleDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).join('\n')}
  
</urlset>`;

      fs.writeFileSync(outputFile, sitemap);
      console.log(`✅ Sitemap generated: ${outputFile}`);
      console.log(`   Total URLs: ${vehicles.length + 1}`);
    } catch (error) {
      console.error('Error:', error);
    }
  });
}).on('error', (error) => {
  console.error('Error fetching vehicles:', error);
});
EOF

node generate-sitemap.js
```

### Option 2: Use Firebase Functions (If Available)

If you have Firebase Functions set up, create a function to serve the sitemap.

### Option 3: Update Before Each Deploy

Before deploying, run the generation script to update the sitemap:

```bash
node generate-sitemap.js
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

## Quick Fix: Manual Generation

1. Visit: `https://lioncarsa.vercel.app/api/vehicles`
2. Copy the JSON response
3. Create `frontend/public/sitemap.xml` with the XML format
4. Deploy to Firebase

## After Generation

1. Deploy to Firebase:
   ```bash
   cd frontend && npm run build && cd ..
   firebase deploy --only hosting
   ```

2. Test sitemap:
   - Visit: `https://auditra-web.web.app/sitemap.xml`
   - Should show XML with all vehicles

3. Submit to Google:
   - Go to Google Search Console
   - Submit: `https://auditra-web.web.app/sitemap.xml`

