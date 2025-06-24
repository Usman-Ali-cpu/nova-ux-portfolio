
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthRouteProps {
  children: React.ReactNode;
  requiredRole?: 'runner' | 'business' | null;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, requiredRole = null }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ redirectTo: location.pathname }} replace />;
  }

  // If a specific role is required and the user doesn't have it
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the right role
  return <>{children}</>;
};

export default AuthRoute;
