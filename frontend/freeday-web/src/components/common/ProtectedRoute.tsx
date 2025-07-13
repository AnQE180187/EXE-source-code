import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Đang kiểm tra quyền truy cập...</div>;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  // if (!('role' in user) || !allowedRoles.includes((user as any).role)) {
  //   return <Navigate to="/not-found" replace />;
  // }
  return <>{children}</>;
};

export default ProtectedRoute;
