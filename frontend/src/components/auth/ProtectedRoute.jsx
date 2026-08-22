import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — wraps routes requiring authentication.
 * Currently permissive: allows mock-user access when backend is offline.
 * Set `adminOnly` to restrict to admin users.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const location = useLocation();

  // Permissive mode: allow access even without explicit login
  // since the app falls back to mock user. If you want strict auth,
  // uncomment the redirect below.
  //
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
