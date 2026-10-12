import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Route protection guard for authenticated pages and role authorization
 */
export const ProtectedRoute = ({ children, requireOrganizer = false }) => {
  const { user, isOrganizer, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Verifying credentials...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login while preserving target path for redirect-back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOrganizer && !isOrganizer) {
    // User is signed in but lacks organizer role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
