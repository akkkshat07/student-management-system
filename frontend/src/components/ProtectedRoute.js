import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUser } from '../services/api';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const user = getUser();

 
  if (!isAuthenticated()) {
   
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (requiredRole && user?.role !== requiredRole) {
  
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
};

export const AuthenticatedRoute = ({ children }) => {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
