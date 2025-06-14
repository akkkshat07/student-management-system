import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUser } from '../services/api';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const user = getUser();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to dashboard if user doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Higher-order component for admin-only routes
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
};

// Higher-order component for authenticated routes (any role)
export const AuthenticatedRoute = ({ children }) => {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
