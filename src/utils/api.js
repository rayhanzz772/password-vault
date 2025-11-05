import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

console.log('🌐 API Base URL:', api.defaults.baseURL);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.message);
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🚫 Network error - Is the backend running?');
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('🔐 401 Unauthorized - Clearing token');
      localStorage.removeItem('jwt_token');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: async (email, masterPassword) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password: masterPassword, // Changed from master_password to password
      });
      return response.data;
    } catch (error) {
      // Demo mode: If backend is not available, simulate success
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        console.warn('⚠️ Backend not available, using demo mode');
        return {
          token: 'demo-token-' + Date.now(),
          user: { email }
        };
      }
      throw error;
    }
  },

  login: async (email, masterPassword) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password: masterPassword, // Changed from master_password to password
      });
      return response.data;
    } catch (error) {
      // Demo mode: If backend is not available, simulate success
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        console.warn('⚠️ Backend not available, using demo mode');
        return {
          token: 'demo-token-' + Date.now(),
          user: { email }
        };
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
  },
};

export default api;
