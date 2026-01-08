import React, { useState } from 'react';
import './PhotoGallery.css';

const PhotoGallery = ({ images, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Helper function to get full image URL
  const getImageUrl = (image) => {
    if (!image) return '';
    // If it's already a full URL (http/https), return as is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    // If it's a local path starting with /uploads, prepend backend URL
    if (image.startsWith('/uploads')) {
      // In production, images should be full URLs already or stored in Firebase Storage
      // For development, use localhost
      const backendUrl = process.env.REACT_APP_API_URL || 
        (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001');
      return `${backendUrl}${image}`;
    }
    // Otherwise return as is
    return image;
  };

  if (!images || images.length === 0) {
    return (
      <div className="photo-gallery">
        <div className="photo-gallery-main">
          <div className="no-photo-placeholder">
            <span>📷 No Photos Available</span>
          </div>
        </div>
      </div>
    );
  }

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
  };

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="photo-gallery">
      <div className="photo-gallery-main">
        <div className="main-photo-container">
          <img
            src={getImageUrl(images[selectedIndex])}
            alt={`${title} - Photo ${selectedIndex + 1}`}
            className="main-photo"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
            }}
          />
          {images.length > 1 && (
            <>
              <button
                className="photo-nav-btn photo-nav-prev"
                onClick={handlePrevious}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                className="photo-nav-btn photo-nav-next"
                onClick={handleNext}
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}
          <div className="photo-counter">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="photo-thumbnails">
          {images.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${index === selectedIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={getImageUrl(image)}
                alt={`${title} thumbnail ${index + 1}`}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150x100?text=Image';
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;

