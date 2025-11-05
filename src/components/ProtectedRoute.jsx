import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('🔒 ProtectedRoute check:', { isAuthenticated, isLoading });
    const token = localStorage.getItem('jwt_token');
    console.log('🔒 Token in localStorage:', token ? 'exists' : 'missing');
    if (token) {
      console.log('🔒 Token preview:', token.substring(0, 50) + '...');
    }
  }, [isAuthenticated, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('⏳ ProtectedRoute: Still loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute: Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  console.log('✅ ProtectedRoute: Authenticated, rendering children');
  return children;
};

export default ProtectedRoute;
