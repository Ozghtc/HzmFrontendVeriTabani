import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated && !checkAuth()) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/admin-panel-0923/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 