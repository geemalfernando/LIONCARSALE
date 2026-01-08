import axios from 'axios';

// REST API Base URL
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://lioncarsa.vercel.app' 
    : 'http://localhost:5001');

// API client
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Vehicles API
export const vehiclesAPI = {
  // Get all vehicles with optional filters
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.make) params.append('make', filters.make);
      if (filters.year) params.append('year', filters.year);
      if (filters.minYear) params.append('minYear', filters.minYear);
      if (filters.maxYear) params.append('maxYear', filters.maxYear);
      
      const queryString = params.toString();
      const url = `/api/vehicles${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      
      if (response.data.status === 'OK') {
        // Convert id to _id for compatibility
        return response.data.data.map(v => ({ ...v, _id: v.id }));
      }
      
      throw new Error(response.data.message || 'Failed to fetch vehicles');
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  // Get single vehicle
  getById: async (id) => {
    try {
      const response = await api.get(`/api/vehicles/${id}`);
      
      if (response.data.status === 'OK') {
        // Convert id to _id for compatibility
        return { ...response.data.data, _id: response.data.data.id };
      }
      
      throw new Error(response.data.message || 'Vehicle not found');
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  },

  // Create vehicle
  create: async (vehicleData) => {
    try {
      const response = await api.post('/api/vehicles', vehicleData);
      
      if (response.data.status === 'OK') {
        // Convert id to _id for compatibility
        return { ...response.data.data, _id: response.data.data.id };
      }
      
      throw new Error(response.data.message || 'Failed to create vehicle');
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // Get distinct makes
  getMakes: async () => {
    try {
      const response = await api.get('/api/vehicles/filters/makes');
      
      if (response.data.status === 'OK') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch makes');
    } catch (error) {
      console.error('Error fetching makes:', error);
      throw error;
    }
  },

  // Get distinct years
  getYears: async () => {
    try {
      const response = await api.get('/api/vehicles/filters/years');
      
      if (response.data.status === 'OK') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch years');
    } catch (error) {
      console.error('Error fetching years:', error);
      throw error;
    }
  },
};

export default api;
