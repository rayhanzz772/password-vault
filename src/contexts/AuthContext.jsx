import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [masterPassword, setMasterPassword] = useState(null); // Store in memory only
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // Validate token by making a request or decode it
      setIsAuthenticated(true);
      // You might want to fetch user details here
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const data = await authAPI.login(email, password);
      console.log('✅ Login response:', data);
      
      // Save JWT token to localStorage
      localStorage.setItem('jwt_token', data.token);
      console.log('💾 Token saved to localStorage');
      
      // Store master password in React state only (not localStorage!)
      setMasterPassword(password);
      
      // Update auth state
      setUser(data.user || { email });
      setIsAuthenticated(true);
      console.log('✅ Auth state updated, isAuthenticated: true');
      
      return { success: true, data };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (email, password) => {
    try {
      const data = await authAPI.register(email, password);
      
      // Optionally auto-login after registration
      if (data.token) {
        localStorage.setItem('jwt_token', data.token);
        setMasterPassword(password);
        setUser(data.user || { email });
        setIsAuthenticated(true);
      }
      
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setMasterPassword(null); // Clear from memory
    setIsAuthenticated(false);
  };

  const value = {
    user,
    masterPassword,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
