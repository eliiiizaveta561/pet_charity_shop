import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from '../layout/Layout';
import RequireAuth from './RequireAuth';
import HomePage from '@/pages/home/HomePage';
import CatalogPage from '@/pages/catalog/CatalogPage';
import ProductPage from '@/pages/product/ProductPage';
import CartPage from '@/pages/cart/CartPage';
import CharitiesPage from '@/pages/charities/CharitiesPage';
import CheckoutPage from '@/pages/checkout/CheckoutPage';
import LoginPage from '@/pages/login/LoginPage';
import RegisterPage from '@/pages/register/RegisterPage';
import OrdersPage from '@/pages/orders/OrdersPage';
import AdminProductsPage from '@/pages/admin-products/AdminProductsPage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          {/* Публичные страницы */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/charities" element={<CharitiesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Только после входа */}
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <OrdersPage />
              </RequireAuth>
            }
          />

          {/* Только для администратора */}
          <Route
            path="/admin/products"
            element={
              <RequireAuth role="admin">
                <AdminProductsPage />
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
