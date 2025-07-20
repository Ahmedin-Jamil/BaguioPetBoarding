import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects admin routes. If the user is not authenticated, redirect to /admin/login
 * while preserving the originally requested location in route state so the
 * login page can navigate back after successful authentication.
 */
const RequireAdminAuth = ({ children }) => {
  const { currentAdmin } = useAuth();
  const location = useLocation();

  if (!currentAdmin) {
    // send user to login, remember where they were trying to go
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAdminAuth;
