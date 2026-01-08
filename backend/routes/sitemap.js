const express = require('express');
const Vehicle = require('../models/Vehicle');
const { mongoose, connectDatabase } = require('../config/database');

// Helper function to ensure database is connected
async function ensureConnected() {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDatabase();
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }
}

// Generate XML sitemap - this is used as a route handler, not a router
async function generateSitemap(req, res) {
  try {
    await ensureConnected();

    const vehicles = await Vehicle.find({}).select('_id updatedAt').sort({ updatedAt: -1 }).lean();
    const baseUrl = 'https://auditra-web.web.app';
    const currentDate = new Date().toISOString().split('T')[0];

    // Generate sitemap XML
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
  return `  <url>
    <loc>${baseUrl}/vehicle/${vehicle._id}</loc>
    <lastmod>${vehicleDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).join('\n')}
  
</urlset>`;

    res.set('Content-Type', 'text/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
}

module.exports = generateSitemap;

