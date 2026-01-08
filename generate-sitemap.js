const https = require('https');
const fs = require('fs');
const path = require('path');

const backendUrl = 'https://lioncarsa.vercel.app';
const baseUrl = 'https://auditra-web.web.app';
const outputFile = path.join(__dirname, 'frontend', 'public', 'sitemap.xml');

console.log('🔄 Generating sitemap...');
console.log(`   Backend: ${backendUrl}`);
console.log(`   Frontend: ${baseUrl}`);

https.get(`${backendUrl}/api/vehicles`, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (response.status !== 'OK') {
        console.error('⚠️  Backend returned error:', response.message || 'Unknown error');
        console.error('⚠️  Response:', data.substring(0, 200));
        console.log('\n💡 Trying alternative: Creating sitemap with homepage only...');
        console.log('💡 You can manually add vehicle URLs later or fix the backend connection.');
        
        // Create basic sitemap with just homepage
        const currentDate = new Date().toISOString().split('T')[0];
        const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
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
  
</urlset>`;

        const dir = path.dirname(outputFile);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(outputFile, basicSitemap);
        console.log(`✅ Basic sitemap created (homepage only)`);
        console.log(`   File: ${outputFile}`);
        console.log(`   ⚠️  Add vehicle URLs manually or fix backend connection and regenerate`);
        process.exit(0);
      }
      
      const vehicles = response.data || [];
      const currentDate = new Date().toISOString().split('T')[0];
      
      console.log(`   Found ${vehicles.length} vehicles`);
      
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

      // Ensure directory exists
      const dir = path.dirname(outputFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputFile, sitemap);
      console.log(`✅ Sitemap generated successfully!`);
      console.log(`   File: ${outputFile}`);
      console.log(`   Total URLs: ${vehicles.length + 1} (${vehicles.length} vehicles + 1 homepage)`);
      console.log(`\n📤 Next steps:`);
      console.log(`   1. Build frontend: cd frontend && npm run build`);
      console.log(`   2. Deploy: firebase deploy --only hosting`);
      console.log(`   3. Submit to Google: https://auditra-web.web.app/sitemap.xml`);
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.error('   Response:', data.substring(0, 300));
      
      // Check if existing sitemap exists
      if (fs.existsSync(outputFile)) {
        console.log('\n💡 Using existing sitemap file...');
        console.log(`   Existing file: ${outputFile}`);
        console.log('   ⚠️  If backend is fixed, regenerate with: node generate-sitemap.js');
        process.exit(0);
      } else {
        console.log('\n💡 Creating minimal sitemap (homepage only)...');
        const currentDate = new Date().toISOString().split('T')[0];
        const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
        
        const dir = path.dirname(outputFile);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(outputFile, minimalSitemap);
        console.log(`✅ Minimal sitemap created`);
        process.exit(0);
      }
    }
  });
}).on('error', (error) => {
  console.error('❌ Error connecting to backend:', error.message);
  console.error('   Backend URL:', backendUrl);
  
  // Check if existing sitemap exists
  if (fs.existsSync(outputFile)) {
    console.log('\n💡 Using existing sitemap file...');
    console.log(`   Existing file: ${outputFile}`);
    console.log('   ⚠️  Fix backend connection and regenerate when ready');
    process.exit(0);
  } else {
    console.log('\n💡 Creating minimal sitemap (homepage only)...');
    const currentDate = new Date().toISOString().split('T')[0];
    const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputFile, minimalSitemap);
    console.log(`✅ Minimal sitemap created`);
    process.exit(0);
  }
});

