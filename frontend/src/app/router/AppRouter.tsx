import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from '../layout/Layout';
import HomePage from '@/pages/home/HomePage';
import CatalogPage from '@/pages/catalog/CatalogPage';
import ProductPage from '@/pages/product/ProductPage';
import CartPage from '@/pages/cart/CartPage';
import CharitiesPage from '@/pages/charities/CharitiesPage';
import CheckoutPage from '@/pages/checkout/CheckoutPage';
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
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/charities" element={<CharitiesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
