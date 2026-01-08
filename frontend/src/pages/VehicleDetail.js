import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const pageTitle = vehicle ? `${vehicle.title} - ${vehicle.year} ${vehicle.make} ${vehicle.model} | Lion Car Sale Sri Lanka` : 'Vehicle Details | Lion Car Sale';
  const pageDescription = vehicle 
    ? `Buy ${vehicle.year} ${vehicle.make} ${vehicle.model} in Sri Lanka. Price: ${formatPrice(vehicle.price)}. ${vehicle.description || 'View full details, photos, and contact seller.'}` 
    : 'View vehicle details on Lion Car Sale';

  return (
    <div className="vehicle-detail-container">
      {vehicle && (
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={`${vehicle.make}, ${vehicle.model}, ${vehicle.year}, car sale sri lanka, used car, vehicle for sale, ${vehicle.make} ${vehicle.model} sri lanka, buy ${vehicle.make}`} />
          <meta property="og:title" content={`${vehicle.title} - Lion Car Sale Sri Lanka`} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:image" content={vehicle.images && vehicle.images[0] ? vehicle.images[0] : 'https://auditra-web.web.app/logo.jpg'} />
          <meta property="og:type" content="product" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Vehicle",
              "name": vehicle.title,
              "description": vehicle.description || `${vehicle.year} ${vehicle.make} ${vehicle.model} for sale in Sri Lanka`,
              "image": vehicle.images && vehicle.images.length > 0 ? vehicle.images : [],
              "brand": {
                "@type": "Brand",
                "name": vehicle.make
              },
              "model": vehicle.model,
              "productionDate": vehicle.year,
              "color": vehicle.color || undefined,
              "mileageFromOdometer": vehicle.mileage ? {
                "@type": "QuantitativeValue",
                "value": vehicle.mileage,
                "unitCode": "MIL"
              } : undefined,
              "offers": {
                "@type": "Offer",
                "price": vehicle.price,
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "Lion Car Sale"
                }
              },
              "vehicleIdentificationNumber": vehicle.id,
              "itemCondition": "https://schema.org/UsedCondition"
            })}
          </script>
          <link rel="canonical" href={`https://auditra-web.web.app/vehicle/${vehicle.id}`} />
        </Helmet>
      )}
      
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
            <PhotoGallery images={vehicle.images || []} title={vehicle.title} sold={vehicle.sold} />
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

            {vehicle.sellerPhone && (
              <div className="seller-phone-section">
                <div className="spec-item-detail">
                  <span className="spec-label">📞 Seller Phone</span>
                  <span className="spec-value">{vehicle.sellerPhone}</span>
                </div>
              </div>
            )}

            <div className="vehicle-actions">
              <button 
                className="contact-btn" 
                onClick={() => {
                  if (vehicle.sellerPhone) {
                    // Show phone number in alert
                    alert(`Seller Phone Number:\n${vehicle.sellerPhone}\n\nClick OK to call or copy the number.`);
                    // Try to open phone dialer on mobile devices
                    window.location.href = `tel:${vehicle.sellerPhone.replace(/[^\d+]/g, '')}`;
                  } else {
                    alert('Seller phone number is not available.');
                  }
                }}
              >
                📞 Contact Seller
              </button>
              <button className="favorite-btn">❤️ Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetail;

