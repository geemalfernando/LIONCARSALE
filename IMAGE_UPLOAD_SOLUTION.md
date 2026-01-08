# Image Upload Solution

## ⚠️ Important: File Upload Limitation

**Vercel serverless functions have a read-only filesystem**. This means:
- ❌ Uploaded files **cannot be permanently stored** on Vercel
- ❌ Files uploaded to `/tmp` are **deleted after function execution**
- ✅ **Use image URLs instead** (recommended)

## Solutions

### Option 1: Use Image URLs (Recommended) ✅

**Best Solution**: Use image URLs from image hosting services.

**How it works:**
1. Upload images to an image hosting service (Imgur, Google Photos, Cloudinary, etc.)
2. Copy the image URL
3. Paste the URL in the admin form

**Image Hosting Services:**
- **Imgur**: https://imgur.com (free, no account needed for uploads)
- **Google Photos**: Share image → Copy link
- **Cloudinary**: Free tier available
- **AWS S3**: With CloudFront CDN
- **Any image hosting service**

**Steps:**
1. Upload image to Imgur (drag & drop)
2. Right-click image → "Copy image address"
3. Paste URL in the admin form

### Option 2: Use Cloud Storage (Advanced)

If you need file uploads, use cloud storage:
- **Cloudinary** (recommended - free tier)
- **AWS S3**
- **Google Cloud Storage**
- **Firebase Storage**

Then upload files directly from frontend to cloud storage.

### Option 3: Alternative Backend (Not Recommended)

Use a different hosting service that supports file uploads:
- Railway
- Render
- Fly.io

But this requires moving away from Vercel.

## Current Implementation

The form supports **both**:
1. ✅ **Image URLs** - Works perfectly (recommended)
2. ⚠️ **File Upload** - Works in development, but files won't persist in Vercel production

## How to Add Images (Recommended Way)

### Step 1: Upload Image to Image Hosting
- Go to https://imgur.com
- Drag & drop your image
- Right-click → "Copy image address"

### Step 2: Paste URL in Admin Form
- Go to Admin panel
- Paste the image URL in the "Enter image URL" field
- Click "Add Another Photo" for more images

## Updated Features

✅ **Seller Phone Number** field added to form  
✅ **Contact Seller** button shows phone number in alert  
✅ **Image URL input** works perfectly  
⚠️ **File upload** - Limited in Vercel (use URLs instead)

## Quick Fix for Now

**For production, use image URLs:**
1. Upload images to Imgur or similar service
2. Copy the image URL
3. Paste in admin form

File upload feature works locally but won't persist files in Vercel serverless environment.

