import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import OAuth2RedirectHandler from '@/features/auth/components/OAuth2RedirectHandler';
import Loading from '@/components/common/Loading';

// Lazy loading pages
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const HomePage = lazy(() => import('../features/home/pages/HomePage'));
const ProductDetailPage = lazy(() => import('../features/products/pages/ProductDetailPage'));
const ProductsPage = lazy(() => import('../features/products/pages/ProductsPage'));
const CartPage = lazy(() => import('../features/cart/pages/CartPage'));
const AdminRoutes = lazy(() => import('../admin/routes'));

// Component for 404 page
const NotFound = () => (
  <div className="h-screen flex items-center justify-center flex-col">
    <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
    <p className="mt-2">The page you are looking for does not exist.</p>
  </div>
);

// Loading component
const LoadingFallback = () => (
  <Loading fullScreen message="Loading page..." />
);

const UnauthorizedPage = () => (
  <div className="h-screen flex items-center justify-center flex-col">
    <h1 className="text-3xl font-bold">403 - Unauthorized</h1>
    <p className="mt-2">You don't have permission to access this page.</p>
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
        
        {/* Products routes */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        
        {/* Cart routes */}
        <Route path="/cart" element={<CartPage />} />
        
        {/* Authentication routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <LoginPage />
          } 
        />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />        
        
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* 404 route */}
        <Route path="/404" element={<NotFound />} />
        
        {/* Catch all route - redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;