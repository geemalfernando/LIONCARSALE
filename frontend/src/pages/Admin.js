import React, { useState } from 'react';
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
      
      // Clear form after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to add vehicle. Please try again.');
      console.error('Error adding vehicle:', error);
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
            <h1>🦁 Admin Panel - Add Vehicle</h1>
            <p className="admin-subtitle">Add a new vehicle with photos to the inventory</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
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

        <VehicleForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default Admin;

