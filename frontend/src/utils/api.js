// API utility functions
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const getApiUrl = () => API_URL;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a local path starting with /uploads, prepend API URL
  if (imagePath.startsWith('/uploads')) {
    return `${API_URL}${imagePath}`;
  }
  
  // Otherwise return as is
  return imagePath;
};

export const getUploadUrl = () => `${API_URL}/api/upload/single`;

