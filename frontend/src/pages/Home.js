import React, { useState, useEffect } from 'react';
import VehicleCard from '../components/VehicleCard';
import FilterSidebar from '../components/FilterSidebar';
import { graphqlRequest } from '../utils/graphql';
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

  // Fetch vehicles with filters using GraphQL
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const filter = {};
        if (filters.search) filter.search = filters.search;
        if (filters.year) filter.year = parseInt(filters.year);
        if (filters.make) filter.make = filters.make;
        if (filters.minYear) filter.minYear = parseInt(filters.minYear);
        if (filters.maxYear) filter.maxYear = parseInt(filters.maxYear);

        const query = `
          query GetVehicles($filter: VehicleFilter) {
            vehicles(filter: $filter) {
              id
              title
              make
              model
              year
              price
              images
              description
              mileage
              color
              fuelType
              transmission
              createdAt
            }
          }
        `;

        const data = await graphqlRequest(query, { filter: Object.keys(filter).length > 0 ? filter : null });
        // Convert id back to _id for compatibility
        let vehicles = data.vehicles.map(v => ({ ...v, _id: v.id }));
        
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

  // Fetch distinct makes and years for filters using GraphQL
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const query = `
          query GetFilters {
            makes
            years
          }
        `;

        const data = await graphqlRequest(query);
        setMakes(data.makes);
        setYears(data.years);
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

