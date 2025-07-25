import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_URL } from '../config';

// Create the authentication context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  // Initialize auth state from localStorage if available
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('currentAdmin');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Remove hard-coded admin list; authentication will be handled by backend JWT
  const [adminUsers] = useState([]);



  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('currentAdmin');
      localStorage.setItem('isAuthenticated', 'false');
    }
  }, [currentAdmin, isAuthenticated]);

  // Login function
  const login = async (username, password) => {
    setAuthLoading(true);
    setAuthError(null);
    
    try {
            // Call backend for admin login
      const response = await fetch(`${API_URL}/api/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (process.env.NODE_ENV !== 'production') {
        // Helpful console output so we can see exactly what the backend sent
        // console.debug('Admin login response:', data);
      }

      if (!response.ok) {
        const message = data?.message || 'Invalid username or password';
        setAuthError(message);
        return { success: false, error: message };
      }

      // Accept token in either structure: data.data.token (new) or data.token (old)
      const token = data?.data?.token || data?.token;
      const adminPayload = data?.data || data;
      // Accept admin object in several shapes
      let admin = null;
      if (adminPayload?.admin_id && adminPayload?.username) {
        admin = { admin_id: adminPayload.admin_id, username: adminPayload.username };
      } else if (adminPayload?.user && adminPayload.user.admin_id) {
        admin = { admin_id: adminPayload.user.admin_id, username: adminPayload.user.username };
      }
      if (!token) {
        setAuthError('Login response missing token');
        return { success: false, error: 'Login response missing token' };
      }
      if (!admin) {
        setAuthError('Malformed authentication response');
        return { success: false, error: 'Malformed authentication response' };
      }

      // Store to localStorage for later API calls
      localStorage.setItem('adminToken', token);
      localStorage.setItem('currentAdmin', JSON.stringify(admin));
      localStorage.setItem('isAuthenticated', 'true');

      setCurrentAdmin(admin);
      // persist admin info
      localStorage.setItem('adminToken', token);
      localStorage.setItem('currentAdmin', JSON.stringify(admin));
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      return { success: true, admin };
    } catch (error) {
      setAuthError('An error occurred during login');
      return { success: false, error: 'An error occurred during login' };
    } finally {
      setAuthLoading(false);
    }
  };



  // Logout function
  const logout = () => {
    setCurrentAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentAdmin');
    localStorage.removeItem('adminToken');
    localStorage.setItem('isAuthenticated', 'false');
  };

  // Context value
  const value = {
    currentAdmin,
    isAuthenticated,
    authLoading,
    authError,
    login,

    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};