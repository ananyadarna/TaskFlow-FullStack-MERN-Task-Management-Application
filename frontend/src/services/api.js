import axios from 'axios';

// Create Axios HTTP client instance with base backend API URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Automatically inject Bearer JWT token into request headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
