const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// For Vercel serverless, use /tmp directory (only writable location)
// Note: Files in /tmp are temporary and will be deleted after function execution
const isVercel = process.env.VERCEL || process.env.NOW_REGION;
const uploadsDir = isVercel 
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '../uploads');

// Ensure uploads directory exists
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (error) {
  console.error('⚠️  Warning: Could not create uploads directory:', error.message);
  console.error('⚠️  File uploads may not work in serverless environment.');
  console.error('⚠️  Consider using image URLs instead or cloud storage (e.g., Cloudinary, AWS S3)');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Single file upload
router.post('/single', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded. Please select an image file.' 
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    console.log('✅ File uploaded successfully:', req.file.filename);
    console.log('📁 File saved to:', req.file.path);
    
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'File upload failed' 
    });
  }
});

// Multiple files upload
router.post('/multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({
      success: true,
      urls: fileUrls,
      count: req.files.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

