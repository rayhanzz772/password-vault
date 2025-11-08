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

// Helper to clear auth and redirect
const clearAuthAndRedirect = () => {
  localStorage.removeItem('jwt_token');
  // Only redirect if not already on auth pages
  if (!window.location.pathname.includes('/login') && 
      !window.location.pathname.includes('/register')) {
    console.log('🔄 Redirecting to login...');
    window.location.href = '/login';
  }
};

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
    console.error('❌ Error details:', error.response?.data);
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🚫 Network error - Is the backend running?');
    }
    
    // Handle JWT errors (malformed, expired, invalid)
    if (error.response?.data?.message?.includes('JWT') || 
        error.response?.data?.message?.includes('jwt') ||
        error.response?.data?.error?.includes('JWT') ||
        error.response?.data?.error?.includes('jwt')) {
      console.log('🔐 JWT error detected - Clearing invalid token');
      clearAuthAndRedirect();
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('🔐 401 Unauthorized - Clearing token');
      clearAuthAndRedirect();
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: async (email, masterPassword) => {
    const response = await api.post('/auth/register', {
      email,
      password: masterPassword,
    });
    return response.data;
  },

  login: async (email, masterPassword) => {
    const response = await api.post('/auth/login', {
      email,
      password: masterPassword,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
  },

  // Check if master password is valid
  checkPassword: async (masterPassword) => {
    const response = await api.post('/api/users/check-password', {
      password: masterPassword,
    });
    return response.data;
  },
};

// Categories API endpoints
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/api/categories');
    return response.data;
  },
};

// Vault API endpoints
export const vaultAPI = {
  getAll: async (filters = {}) => {
    // Build query string from filters
    const params = new URLSearchParams();
    
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    if (filters.search || filters.q) {
      params.append('q', filters.search || filters.q);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/api/vault?${queryString}` : '/api/vault';
    
    console.log('🔍 Fetching vault with filters:', filters);
    console.log('📍 API URL:', url);
    
    const response = await api.get(url);
    return response.data;
  },

  create: async (vaultData, masterPassword) => {
    const response = await api.post('/api/vault', {
      ...vaultData,
      master_password: masterPassword,
    });
    return response.data;
  },

  decrypt: async (id, masterPassword) => {
    const response = await api.post(`/api/vault/${id}/decrypt`, {
      master_password: masterPassword,
    });
    return response.data;
  },

  update: async (id, vaultData, masterPassword) => {
    const response = await api.put(`/api/vault/${id}/update`, {
      ...vaultData,
      master_password: masterPassword,
    });
    return response.data;
  },

  delete: async (id, masterPassword) => {
    const response = await api.delete(`/api/vault/${id}/delete`, {
      data: { master_password: masterPassword },
    });
    return response.data;
  },
};

// Logs API endpoints
export const logsAPI = {
  create: async (action) => {
    const response = await api.post('/api/vault/logs', {
      action: action,
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/api/vault/logs');
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/api/vault/recent-activity');
    return response.data;
  },
};

export default api;
