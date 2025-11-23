import React from 'react';
import { Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { config } from '../config/env';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem(config.storage.isAuthenticated) === 'true';

  if (!isAuthenticated) {
    if (config.isDevelopment) {
      console.log('🚫 Acesso negado - redirecionando para login');
    }
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default ProtectedRoute;
