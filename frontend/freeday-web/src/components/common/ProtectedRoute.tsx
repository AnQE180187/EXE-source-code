import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuthStore();

  // While the parent PrivateRoute should handle this, it's a good safeguard.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user's role is in the allowed list
  const isAllowed = allowedRoles.includes(user.role);

  return isAllowed ? <Outlet /> : <Navigate to="/not-found" replace />;
};

export default ProtectedRoute;
