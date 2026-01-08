import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehiclesAPI } from '../utils/api';
import PhotoGallery from '../components/PhotoGallery';
import './VehicleDetail.css';

function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const vehicleData = await vehiclesAPI.getById(id);
        setVehicle(vehicleData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching vehicle:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  if (loading) {
    return (
      <div className="vehicle-detail-container">
        <div className="loading">Loading vehicle details...</div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="vehicle-detail-container">
        <div className="error-message">
          <p>❌ {error || 'Vehicle not found'}</p>
          <button onClick={() => navigate('/')} className="back-btn">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-detail-container">
      <button onClick={() => navigate('/')} className="back-btn">
        ← Back to Vehicles
      </button>

      <div className="vehicle-detail">
        <div className="vehicle-detail-header">
          <h1>{vehicle.title}</h1>
          <div className="vehicle-header-info">
            <span className="vehicle-make-model-large">
              {vehicle.make} {vehicle.model}
            </span>
            <span className="vehicle-year-badge">{vehicle.year}</span>
          </div>
        </div>

        <div className="vehicle-detail-content">
          <div className="vehicle-photos-section">
            <PhotoGallery images={vehicle.images || []} title={vehicle.title} />
          </div>

          <div className="vehicle-info-section">
            <div className="vehicle-price-large">
              {formatPrice(vehicle.price)}
            </div>

            <div className="vehicle-specs-grid">
              {vehicle.mileage > 0 && (
                <div className="spec-item-detail">
                  <span className="spec-label">📍 Mileage</span>
                  <span className="spec-value">{formatMileage(vehicle.mileage)} miles</span>
                </div>
              )}
              {vehicle.color && (
                <div className="spec-item-detail">
                  <span className="spec-label">🎨 Color</span>
                  <span className="spec-value">{vehicle.color}</span>
                </div>
              )}
              {vehicle.fuelType && (
                <div className="spec-item-detail">
                  <span className="spec-label">⛽ Fuel Type</span>
                  <span className="spec-value">{vehicle.fuelType}</span>
                </div>
              )}
              {vehicle.transmission && (
                <div className="spec-item-detail">
                  <span className="spec-label">⚙️ Transmission</span>
                  <span className="spec-value">{vehicle.transmission}</span>
                </div>
              )}
            </div>

            {vehicle.description && (
              <div className="vehicle-description-section">
                <h3>Description</h3>
                <p>{vehicle.description}</p>
              </div>
            )}

            <div className="vehicle-actions">
              <button className="contact-btn">Contact Seller</button>
              <button className="favorite-btn">❤️ Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetail;

