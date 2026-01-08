import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import VehicleCard from '../components/VehicleCard';
import FilterSidebar from '../components/FilterSidebar';
import { vehiclesAPI } from '../utils/api';
import './Home.css';

function Home() {
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  // Sidebar open by default on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [filters, setFilters] = useState({
    search: '',
    year: '',
    make: '',
    minYear: '',
    maxYear: ''
  });
  const [makes, setMakes] = useState([]);
  const [years, setYears] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  // Sort vehicles function
  const sortVehicles = (vehicles, sortOption) => {
    const sorted = [...vehicles];
    switch (sortOption) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      default:
        return sorted;
    }
  };

  // Fetch vehicles with filters using REST API
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const filter = {};
        if (filters.search && filters.search.trim()) filter.search = filters.search.trim();
        if (filters.make && filters.make.trim()) filter.make = filters.make.trim();
        
        // Handle year filters - prioritize range over exact
        if (filters.minYear || filters.maxYear) {
          // Year range takes priority
          if (filters.minYear) filter.minYear = parseInt(filters.minYear);
          if (filters.maxYear) filter.maxYear = parseInt(filters.maxYear);
        } else if (filters.year && filters.year.trim()) {
          // Exact year only if no range specified
          filter.year = parseInt(filters.year);
        }

        let vehicles = await vehiclesAPI.getAll(filter);
        
        // Sort vehicles
        vehicles = sortVehicles(vehicles, sortBy);
        
        setFilteredVehicles(vehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [filters, sortBy]);

  // Fetch distinct makes and years for filters using REST API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [makesData, yearsData] = await Promise.all([
          vehiclesAPI.getMakes(),
          vehiclesAPI.getYears()
        ]);
        
        setMakes(makesData);
        setYears(yearsData);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilters();
  }, []);

  // Handle window resize for sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      year: '',
      make: '',
      minYear: '',
      maxYear: ''
    });
  };

  return (
    <div className="home-container">
      <Helmet>
        <title>Lion Car Sale - Buy & Sell Vehicles in Sri Lanka | Used Cars for Sale</title>
        <meta name="description" content={`Browse ${filteredVehicles.length} vehicles for sale in Sri Lanka. Find used cars, bikes, and vehicles. Search by make, model, year, and price. ${filters.make ? filters.make + ' ' : ''}${filters.year ? filters.year + ' ' : ''}vehicles available.`} />
        <meta name="keywords" content="lion car sale, car sale sri lanka, used cars sri lanka, vehicles for sale sri lanka, buy car sri lanka, sell car sri lanka, {filters.make}, {filters.year}, second hand cars Sri Lanka, vehicle sale, car market Sri Lanka" />
        <meta property="og:title" content="Lion Car Sale - Buy & Sell Vehicles in Sri Lanka" />
        <meta property="og:description" content={`Find ${filteredVehicles.length} vehicles for sale in Sri Lanka. Browse used cars and vehicles from trusted sellers.`} />
        <link rel="canonical" href="https://auditra-web.web.app/" />
      </Helmet>
      
      <FilterSidebar
        filters={filters}
        makes={makes}
        years={years}
        onFilterChange={handleFilterChange}
        onClear={clearFilters}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="home-content">
        <div className="results-header">
          <div className="results-title">
            <h2>
              {loading ? 'Loading...' : `${filteredVehicles.length} Vehicle${filteredVehicles.length !== 1 ? 's' : ''} for sale`}
            </h2>
          </div>
          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Date: Newest on top</option>
              <option value="oldest">Date: Oldest on top</option>
              <option value="price-high">Price: High to low</option>
              <option value="price-low">Price: Low to high</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading vehicles...</div>
        ) : filteredVehicles.length === 0 ? (
          <div className="no-results">
            <p>No vehicles found matching your criteria.</p>
            <button onClick={clearFilters} className="clear-btn">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="vehicles-grid">
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

