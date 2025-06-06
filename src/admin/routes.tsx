import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';

import CategoryList from './pages/categories/CategoryList';
import CategoryForm from './pages/categories/CategoryForm';
import RegionList from './pages/regions/RegionList';
import RegionForm from './pages/regions/RegionForm';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import CategoryDetail from './pages/categories/CategoryDetail';
import ProductDetail from './pages/products/ProductDetail';
import QRCodeList from './pages/qrcodes/QRCodeList';
import QRCodeForm from './pages/qrcodes/QRCodeForm';
import OrderList from './pages/orders/OrderList';
import OrderDetail from './pages/orders/OrderDetail';

const AdminRoutes: React.FC = () => {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductDetail />} />
          
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/categories/edit/:id" element={<CategoryForm />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />
          
          <Route path="/regions" element={<RegionList />} />
          <Route path="/regions/new" element={<RegionForm />} />
          <Route path="/regions/:id" element={<RegionForm />} />

          <Route path="/qrcodes" element={<QRCodeList />} />
          <Route path="/qrcodes/new" element={<QRCodeForm />} />
          
          {/* Order routes */}
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    </AdminProtectedRoute>
  );
};

export default AdminRoutes;