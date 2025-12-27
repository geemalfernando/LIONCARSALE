import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Admin from './pages/Admin';
import VehicleDetail from './pages/VehicleDetail';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="main-nav">
      <Link to="/" className="nav-logo">
        <img src="/logo.jpg" alt="Lion Car Sale" className="logo-image" />
        <span>Lion Car Sale</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <img src="/logo.jpg" alt="Lion Car Sale Logo" className="header-logo" />
            <div className="header-text">
              <h1>Lion Car Sale</h1>
              <p>Find Your Perfect Vehicle</p>
            </div>
          </div>
        </header>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

