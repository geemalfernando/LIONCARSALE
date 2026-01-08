import React, { useState } from 'react';
import './VehicleForm.css';

const VehicleForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    description: '',
    mileage: '',
    color: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    sellerPhone: '',
    images: ['']
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(prev => ({ ...prev, [index]: 'Uploading...' }));

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Use environment variable or default to Vercel backend in production
      const backendUrl = process.env.REACT_APP_API_URL || 
        (process.env.NODE_ENV === 'production' 
          ? 'https://lioncarsa.vercel.app' 
          : 'http://localhost:5001');
      
      console.log('Uploading to:', `${backendUrl}/api/upload/single`);
      
      const response = await fetch(`${backendUrl}/api/upload/single`, {
        method: 'POST',
        body: formData
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || 'Upload failed' };
        }
        throw new Error(errorData.error || errorData.message || `Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload response data:', data);
      
      if (!data.success && !data.url && !data.filename) {
        throw new Error(data.error || 'Invalid response from server');
      }
      
      // Check if response has url or filename
      let imageUrl;
      if (data.url) {
        // If URL is already complete (starts with http), use it as is
        // Otherwise, prepend backend URL
        imageUrl = data.url.startsWith('http') ? data.url : `${backendUrl}${data.url}`;
      } else if (data.filename) {
        imageUrl = `${backendUrl}/uploads/${data.filename}`;
      } else {
        throw new Error('Invalid response from server - no URL or filename');
      }
      
      console.log('Final image URL:', imageUrl);
      handleImageChange(index, imageUrl);
      setUploadProgress(prev => ({ ...prev, [index]: 'Uploaded ✓' }));
      
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[index];
          return newProgress;
        });
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error details:', error.message);
      alert(`Failed to upload image: ${error.message}\n\nTip: You can also paste an image URL directly.`);
      setUploadProgress(prev => ({ ...prev, [index]: 'Failed ❌' }));
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[index];
          return newProgress;
        });
      }, 3000);
    } finally {
      setUploading(false);
    }
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Valid year is required';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.sellerPhone || !formData.sellerPhone.trim()) {
      newErrors.sellerPhone = 'Seller phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Filter out empty image URLs
    const filteredImages = formData.images.filter(img => img.trim() !== '');
    
    const vehicleData = {
      ...formData,
      year: parseInt(formData.year),
      price: parseFloat(formData.price),
      mileage: formData.mileage ? parseInt(formData.mileage) : 0,
      images: filteredImages
    };

    onSubmit(vehicleData);
    
    // Reset form after successful submission
    setFormData({
      title: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      description: '',
      mileage: '',
      color: '',
      fuelType: 'Petrol',
      transmission: 'Manual',
      sellerPhone: '',
      images: ['']
    });
  };

  return (
    <form className="vehicle-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h2>Basic Information</h2>
        
        <div className="form-group">
          <label htmlFor="title">Vehicle Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., 2020 Toyota Camry SE"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="make">Make *</label>
            <input
              type="text"
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              placeholder="e.g., Toyota"
              className={errors.make ? 'error' : ''}
            />
            {errors.make && <span className="error-text">{errors.make}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="model">Model *</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., Camry"
              className={errors.model ? 'error' : ''}
            />
            {errors.model && <span className="error-text">{errors.model}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="year">Year *</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              className={errors.year ? 'error' : ''}
            />
            {errors.year && <span className="error-text">{errors.year}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="25000"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>Vehicle Details</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mileage">Mileage</label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              min="0"
              placeholder="30000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="e.g., Silver"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fuelType">Fuel Type</label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="transmission">Transmission</label>
            <select
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="CVT">CVT</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter vehicle description..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="sellerPhone">Seller Phone Number *</label>
          <input
            type="tel"
            id="sellerPhone"
            name="sellerPhone"
            value={formData.sellerPhone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            required
            className={errors.sellerPhone ? 'error' : ''}
          />
          {errors.sellerPhone && <span className="error-text">{errors.sellerPhone}</span>}
        </div>
      </div>

      <div className="form-section">
        <h2>Vehicle Photos</h2>
        <p className="form-help-text">
          Upload local photos or enter image URLs. <strong>Note:</strong> File uploads may not work in production (use image URLs from image hosting services like Imgur, Google Photos, etc.)
        </p>
        
        {formData.images.map((image, index) => (
          <div key={index} className="image-input-group">
            <div className="form-group">
              <label htmlFor={`image-${index}`}>
                Photo {index + 1}
                {index === 0 && <span className="required"> *</span>}
              </label>
              
              <div className="image-upload-options">
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id={`file-${index}`}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleFileUpload(index, file);
                      }
                    }}
                    className="file-input"
                    disabled={uploading}
                  />
                  <label htmlFor={`file-${index}`} className="file-upload-label">
                    📁 Upload Photo
                  </label>
                  {uploadProgress[index] && (
                    <span className="upload-status">{uploadProgress[index]}</span>
                  )}
                </div>
                
                <div className="or-divider">OR</div>
                
                <input
                  type="url"
                  id={`image-${index}`}
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="Enter image URL"
                  className={`url-input ${index === 0 && !image.trim() && errors.images ? 'error' : ''}`}
                />
              </div>
              
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="remove-image-btn"
                >
                  Remove
                </button>
              )}
              
              {image && image.trim() && (
                <div className="image-preview">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    onError={(e) => {
                      console.error('Image preview error:', image);
                      e.target.style.display = 'none';
                      const errorDiv = e.target.parentElement.querySelector('.image-error');
                      if (errorDiv) errorDiv.style.display = 'block';
                    }}
                  />
                  <div className="image-error" style={{ display: 'none', color: 'red', padding: '5px' }}>
                    ⚠️ Invalid image URL - Please check the URL
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addImageField}
          className="add-image-btn"
          disabled={uploading}
        >
          + Add Another Photo
        </button>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Add Vehicle
        </button>
        <button
          type="button"
          onClick={() => {
            setFormData({
              title: '',
              make: '',
              model: '',
              year: new Date().getFullYear(),
              price: '',
              description: '',
              mileage: '',
              color: '',
              fuelType: 'Petrol',
              transmission: 'Manual',
              images: ['']
            });
            setErrors({});
          }}
          className="reset-btn"
        >
          Reset Form
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;

