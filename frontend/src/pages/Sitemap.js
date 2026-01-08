import { useEffect } from 'react';
import { vehiclesAPI } from '../utils/api';

function Sitemap() {
  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const baseUrl = 'https://auditra-web.web.app';
        const vehicles = await vehiclesAPI.getAll({});
        const currentDate = new Date().toISOString().split('T')[0];
        
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
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

        // Set response headers and return XML
        const blob = new Blob([sitemap], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        window.location.href = url;
      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    };
    
    generateSitemap();
  }, []);

  return null;
}

export default Sitemap;

