import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VehicleCard.css';

const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `Rs: ${(price / 1000000).toFixed(2)}M`;
    } else if (price >= 1000) {
      return `Rs: ${(price / 1000).toFixed(0)}K`;
    }
    return `Rs: ${new Intl.NumberFormat('en-US').format(price)}`;
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  const handleClick = () => {
    navigate(`/vehicle/${vehicle.id || vehicle._id}`);
  };

  return (
    <div className={`vehicle-card ${vehicle.sold ? 'sold-vehicle' : ''}`} onClick={handleClick}>
      <div className="vehicle-image-container">
        {vehicle.images && vehicle.images.length > 0 ? (
          <>
            <img
              src={vehicle.images[0].startsWith('data:') || vehicle.images[0].startsWith('http')
                ? vehicle.images[0] 
                : vehicle.images[0].startsWith('/uploads')
                  ? `${process.env.REACT_APP_API_URL || 
                       (process.env.NODE_ENV === 'production' 
                         ? 'https://lioncarsa.vercel.app' 
                         : 'http://localhost:5001')}${vehicle.images[0]}`
                  : vehicle.images[0]}
              alt={vehicle.title}
              className={`vehicle-image ${vehicle.sold ? 'sold-image' : ''}`}
              onError={(e) => {
                console.error('Image load error:', vehicle.images[0]);
                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
              }}
            />
            {vehicle.sold && (
              <div className="sold-overlay">
                <div className="sold-badge">SOLD</div>
              </div>
            )}
          </>
        ) : (
          <div className="vehicle-image-placeholder">
            <span>No Image Available</span>
            {vehicle.sold && (
              <div className="sold-overlay">
                <div className="sold-badge">SOLD</div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="vehicle-info">
        <h3 className="vehicle-title">{vehicle.make} {vehicle.model} {vehicle.year}</h3>
        
        <div className="vehicle-price-row">
          <span className="vehicle-price">{formatPrice(vehicle.price)}</span>
          {vehicle.price === 0 && <span className="negotiable-badge">Negotiable</span>}
        </div>
        
        <div className="vehicle-meta">
          {vehicle.mileage > 0 && (
            <span className="meta-item">
              <span className="meta-icon">📍</span>
              <span className="meta-text">meter {formatMileage(vehicle.mileage)} km</span>
            </span>
          )}
          {vehicle.color && (
            <span className="meta-item">
              <span className="meta-icon">🎨</span>
              <span className="meta-text">{vehicle.color}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;

