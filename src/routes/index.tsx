import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import OAuth2RedirectHandler from "@/features/auth/components/OAuth2RedirectHandler";
import Loading from "@/components/common/Loading";
import QRCodeLandingPage from "@/features/qrcode/pages/QRCodeLandingPage";

// Lazy loading pages
const LuxuryLoginPage = lazy(
  () => import("../features/auth/pages/LuxuryLoginPage")
);
const HomePage = lazy(() => import("../features/home/pages/HomePage"));
const ProductDetailPage = lazy(
  () => import("../features/products/pages/ProductDetailPage")
);
const ProductsPage = lazy(
  () => import("../features/products/pages/ProductsPage")
);
const CartPage = lazy(() => import("../features/cart/pages/CartPage"));
const AdminRoutes = lazy(() => import("../admin/routes"));

// Destination Guide Pages
const DaNangGuidePage = lazy(
  () => import("../features/destination/pages/DaNangGuidePage")
);
const HanoiGuidePage = lazy(
  () => import("../features/destination/pages/HaNoiGuidePage")
);
// NEW: HCM Guide Page
const HCMGuidePage = lazy(
  () => import("../features/destination/pages/HCMGuidePage")
);

// Blog Page
const BlogPage = lazy(() => import("../features/blog/pages/BlogPage"));

// Profile Page
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));

// Custom loader for luxury pages
const LuxuryLoadingFallback = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
    <div className="relative">
      <div className="w-20 h-20 rounded-full bg-primary opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <img src="/logo.svg" alt="MOSIAC" className="h-12 relative z-10" />
    </div>
    <div className="w-16 h-[1px] bg-primary my-4"></div>
    <p className="text-gray-400 text-sm">Loading experience...</p>
  </div>
);

// Enhanced loading component for HCM with special effects
const HCMLoadingFallback = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900 dark:via-red-900 dark:to-pink-900">
    <div className="relative">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-red-500 opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <img src="/logo.svg" alt="MOSIAC" className="h-12 relative z-10" />
    </div>
    <div className="w-16 h-[1px] bg-gradient-to-r from-orange-500 to-red-500 my-4"></div>
    <p className="text-gray-600 dark:text-gray-300 text-sm animate-pulse">Loading Ho Chi Minh City experience...</p>
  </div>
);

// Loading component for other pages
const LoadingFallback = () => <Loading fullScreen message="Loading page..." />;

// Component for 404 page
const NotFound = () => (
  <div className="h-screen flex items-center justify-center flex-col">
    <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
    <p className="mt-2">The page you are looking for does not exist.</p>
  </div>
);

const UnauthorizedPage = () => (
  <div className="h-screen flex items-center justify-center flex-col">
    <h1 className="text-3xl font-bold">403 - Unauthorized</h1>
    <p className="mt-2">You don't have permission to access this page.</p>
  </div>
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      {/* Authentication routes with custom loader */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Suspense fallback={<LuxuryLoadingFallback />}>
              <LuxuryLoginPage />
            </Suspense>
          )
        }
      />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

      {/* Main routes with standard loader */}
      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        }
      />
      <Route
        path="/products"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProductsPage />
          </Suspense>
        }
      />
      <Route
        path="/products/:slug"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProductDetailPage />
          </Suspense>
        }
      />
      <Route
        path="/cart"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <CartPage />
          </Suspense>
        }
      />
      <Route
        path="/qr/:qrId"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <QRCodeLandingPage />
          </Suspense>
        }
      />

      {/* Blog Route */}
      <Route
        path="/blog"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <BlogPage />
          </Suspense>
        }
      />

      {/* Profile Route */}
      <Route
        path="/profile"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProfilePage />
          </Suspense>
        }
      />

      {/* Destination Guide Routes */}
      <Route
        path="/destinations/danang"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <DaNangGuidePage />
          </Suspense>
        }
      />
      
      <Route
        path="/destinations/hanoi"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <HanoiGuidePage />
          </Suspense>
        }
      />

      {/* NEW: Ho Chi Minh City Route with special loading */}
      <Route
        path="/destinations/hcm"
        element={
          <Suspense fallback={<HCMLoadingFallback />}>
            <HCMGuidePage />
          </Suspense>
        }
      />

      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminRoutes />
          </Suspense>
        }
      />
      <Route
        path="/unauthorized"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <UnauthorizedPage />
          </Suspense>
        }
      />
      <Route
        path="/404"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;