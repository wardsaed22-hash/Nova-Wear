import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchOverlay from './components/SearchOverlay';
import MobileMenu from './components/MobileMenu';
import Toast from './components/Toast';
import { useStore } from './context/StoreContext';
import Home from './pages/Home';

// Route-level code splitting: only the home page ships in the initial bundle.
const Shop = lazy(() => import('./pages/Shop'));
const Product = lazy(() => import('./pages/Product'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteEffects() {
  const { pathname, search } = useLocation();
  const { setMenuOpen, setSearchOpen, setCartOpen } = useStore();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
  }, [pathname, search, setMenuOpen, setSearchOpen, setCartOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <span />
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isCheckout = pathname.startsWith('/checkout');

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <RouteEffects />
      <Header minimal={isCheckout} />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isCheckout && <Footer />}
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <Toast />
    </>
  );
}
