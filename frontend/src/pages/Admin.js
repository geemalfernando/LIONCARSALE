import React, { useState, useEffect } from 'react';
import VehicleForm from '../components/VehicleForm';
import { vehiclesAPI } from '../utils/api';
import './Admin.css';

// Hardcoded admin credentials - CHANGE THIS PASSWORD
const ADMIN_PASSWORD = 'LionCar2024!';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'manage'
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [updatingId, setUpdatingId] = useState(null); // Track which vehicle is being updated

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setLoginError('Incorrect password. Access denied.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setLoginError('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (vehicleData) => {
    try {
      setSuccessMessage('');
      setErrorMessage('');
      
      const vehicle = await vehiclesAPI.create(vehicleData);
      
      setSuccessMessage(`Vehicle "${vehicle.title}" added successfully!`);
      
      // Refresh vehicle list if on manage tab
      if (activeTab === 'manage') {
        fetchVehicles();
      }
      
      // Clear form after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to add vehicle. Please try again.');
      console.error('Error adding vehicle:', error);
    }
  };

  // Fetch all vehicles for management
  const fetchVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const allVehicles = await vehiclesAPI.getAll({});
      setVehicles(allVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setErrorMessage('Failed to load vehicles. Please refresh the page.');
    } finally {
      setLoadingVehicles(false);
    }
  };

  // Load vehicles when switching to manage tab
  useEffect(() => {
    if (isAuthenticated && activeTab === 'manage') {
      fetchVehicles();
    }
  }, [isAuthenticated, activeTab]);

  // Toggle sold status
  const toggleSoldStatus = async (vehicleId, currentStatus, vehicleTitle) => {
    // Confirm action
    const action = currentStatus ? 'mark as available' : 'mark as sold';
    const confirmMessage = currentStatus 
      ? `Mark "${vehicleTitle}" as AVAILABLE?` 
      : `Mark "${vehicleTitle}" as SOLD?`;
    
    if (!window.confirm(confirmMessage)) {
      return; // User cancelled
    }
    
    try {
      setSuccessMessage('');
      setErrorMessage('');
      setUpdatingId(vehicleId); // Show loading state
      
      await vehiclesAPI.update(vehicleId, { sold: !currentStatus });
      
      setSuccessMessage(`✅ Vehicle "${vehicleTitle}" ${action} successfully!`);
      
      // Refresh vehicle list
      await fetchVehicles();
      
      setUpdatingId(null);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setUpdatingId(null);
      setErrorMessage(error.message || 'Failed to update vehicle status. Please try again.');
      console.error('Error updating vehicle:', error);
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="login-container">
            <h1>🔒 Admin Access</h1>
            <p className="admin-subtitle">Enter password to access admin panel</p>
            
            {loginError && (
              <div className="message error-message">
                ❌ {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="password-input"
                  autoFocus
                />
              </div>
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Show admin panel if authenticated
  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>🦁 Admin Panel</h1>
            <p className="admin-subtitle">
              {activeTab === 'add' ? 'Add a new vehicle with photos to the inventory' : 'Manage vehicles - Mark as sold/available'}
            </p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            ➕ Add Vehicle
          </button>
          <button
            className={`admin-tab ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            📋 Manage Vehicles
          </button>
        </div>

        {successMessage && (
          <div className="message success-message">
            ✅ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="message error-message">
            ❌ {errorMessage}
          </div>
        )}

        {/* Add Vehicle Tab */}
        {activeTab === 'add' && (
          <VehicleForm onSubmit={handleSubmit} />
        )}

        {/* Manage Vehicles Tab */}
        {activeTab === 'manage' && (
          <div className="vehicle-management">
            {loadingVehicles ? (
              <div className="loading">Loading vehicles...</div>
            ) : vehicles.length === 0 ? (
              <div className="no-vehicles">
                <p>No vehicles found. Add your first vehicle using the "Add Vehicle" tab.</p>
              </div>
            ) : (
              <div className="vehicles-list">
                <h2>All Vehicles ({vehicles.length})</h2>
                <div className="vehicles-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Make/Model</th>
                        <th>Year</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map(vehicle => (
                        <tr key={vehicle._id || vehicle.id} className={vehicle.sold ? 'sold-row' : ''}>
                          <td>
                            {vehicle.images && vehicle.images.length > 0 ? (
                              <img
                                src={vehicle.images[0].startsWith('http') 
                                  ? vehicle.images[0] 
                                  : `${process.env.REACT_APP_API_URL || 
                                       (process.env.NODE_ENV === 'production' 
                                         ? 'https://lioncarsa.vercel.app' 
                                         : 'http://localhost:5001')}${vehicle.images[0]}`}
                                alt={vehicle.title}
                                className="vehicle-thumbnail"
                              />
                            ) : (
                              <div className="vehicle-thumbnail-placeholder">No Image</div>
                            )}
                          </td>
                          <td>{vehicle.title}</td>
                          <td>{vehicle.make} {vehicle.model}</td>
                          <td>{vehicle.year}</td>
                          <td>Rs: {new Intl.NumberFormat('en-US').format(vehicle.price)}</td>
                          <td>
                            <span className={`status-badge ${vehicle.sold ? 'sold' : 'available'}`}>
                              {vehicle.sold ? 'SOLD' : 'Available'}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`toggle-sold-btn ${vehicle.sold ? 'mark-available' : 'mark-sold'}`}
                              onClick={() => toggleSoldStatus(vehicle._id || vehicle.id, vehicle.sold, vehicle.title)}
                              disabled={updatingId === (vehicle._id || vehicle.id)}
                            >
                              {updatingId === (vehicle._id || vehicle.id) 
                                ? 'Saving...' 
                                : vehicle.sold 
                                  ? '✓ Mark Available' 
                                  : '✓ Mark Sold'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;

