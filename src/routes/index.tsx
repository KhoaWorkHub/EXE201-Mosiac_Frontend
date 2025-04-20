import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';

// Lazy loading chỉ trang login
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));

// Component cho trang 404
const NotFound = () => (
  <div className="h-screen flex items-center justify-center flex-col">
    <h1 className="text-3xl font-bold">404 - Không tìm thấy trang</h1>
    <p className="mt-2">Trang bạn đang tìm kiếm không tồn tại.</p>
  </div>
);

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" />
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Authentication routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth2/redirect" element={<LoginPage />} />
        
        {/* Luôn redirect về login từ trang chủ */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 404 route */}
        <Route path="/404" element={<NotFound />} />
        
        {/* Catch all route - điều hướng đến 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;