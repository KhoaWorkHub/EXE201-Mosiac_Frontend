import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAppSelector } from '@/store/hooks';

// Lazy loading pages
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const HomePage = lazy(() => import('../features/home/pages/HomePage'));

// Component for 404 page
const NotFound = () => (
  <div className="h-screen flex items-center justify-center flex-col">
    <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
    <p className="mt-2">The page you are looking for does not exist.</p>
  </div>
);

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" />
  </div>
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Home route */}
        <Route 
          path="/" 
          element={<HomePage />}
        />
        
        {/* Authentication routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <LoginPage />
          } 
        />
        <Route path="/oauth2/redirect" element={<LoginPage />} />
        
        {/* 404 route */}
        <Route path="/404" element={<NotFound />} />
        
        {/* Catch all route - redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;