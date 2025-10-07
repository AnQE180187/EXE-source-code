import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // You can render a loading spinner here while checking auth status
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  if (!user || user.role.toLowerCase() !== 'admin') {
    // If authenticated but not an admin, redirect to a "Not Authorized" page or homepage
    // For now, redirecting to homepage
    return <Navigate to="/" />;
  }

  // If authenticated and is an admin, render the child routes
  return <Outlet />;
};
