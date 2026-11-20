import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { products } from '../data/products';
import { useLocalStorage } from '../hooks/useLocalStorage';

const StoreContext = createContext(null);
const byId = new Map(products.map((p) => [p.id, p]));
const MAX_QTY = 10;

export function StoreProvider({ children }) {
  // Persist only ids + selections; product data is always resolved from the catalogue.
  const [rawCart, setRawCart] = useLocalStorage('nova-wear:cart', []);
  const [rawWishlist, setWishlist] = useLocalStorage('nova-wear:wishlist', []);

  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  /* ---------- Toasts ---------- */
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const showToast = useCallback(
    (toast) => {
      const id = ++toastId.current;
      setToasts((t) => [...t.slice(-2), { id, ...toast }]);
      window.setTimeout(() => dismissToast(id), toast.duration ?? 4200);
    },
    [dismissToast],
  );

  /* ---------- Cart ---------- */
  const cart = useMemo(
    () =>
      (Array.isArray(rawCart) ? rawCart : [])
        .map((item) => ({ ...item, product: byId.get(item.productId) }))
        .filter((item) => item.product && item.qty > 0),
    [rawCart],
  );

  const addToCart = useCallback(
    (product, { color, size, qty = 1 }, { silent = false } = {}) => {
      const key = `${product.id}|${color}|${size}`;
      setRawCart((items) => {
        const list = Array.isArray(items) ? items : [];
        if (list.some((i) => i.key === key)) {
          return list.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i));
        }
        return [...list, { key, productId: product.id, color, size, qty: Math.min(MAX_QTY, qty) }];
      });
      if (!silent) {
        showToast({
          title: 'Added to your bag',
          message: `${product.name} · ${color} · ${size}`,
          image: product.images[0].sm,
          action: { label: 'View bag', onClick: () => setCartOpen(true) },
        });
      }
    },
    [setRawCart, showToast],
  );

  const updateQty = useCallback(
    (key, qty) =>
      setRawCart((items) =>
        qty <= 0
          ? items.filter((i) => i.key !== key)
          : items.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
      ),
    [setRawCart],
  );
  const removeFromCart = useCallback((key) => setRawCart((items) => items.filter((i) => i.key !== key)), [setRawCart]);
  const clearCart = useCallback(() => setRawCart([]), [setRawCart]);

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = cart.reduce((n, i) => n + i.qty * i.product.price, 0);

  /* ---------- Wishlist ---------- */
  const wishlistIds = useMemo(() => (Array.isArray(rawWishlist) ? rawWishlist : []), [rawWishlist]);
  const isWishlisted = useCallback((id) => wishlistIds.includes(id), [wishlistIds]);
  const toggleWishlist = useCallback(
    (product) => {
      const saved = wishlistIds.includes(product.id);
      setWishlist(saved ? wishlistIds.filter((id) => id !== product.id) : [...wishlistIds, product.id]);
      showToast({
        title: saved ? 'Removed from wishlist' : 'Saved to wishlist',
        message: product.name,
        image: product.images[0].sm,
        duration: 2800,
      });
    },
    [wishlistIds, setWishlist, showToast],
  );
  const removeFromWishlist = useCallback(
    (id) => setWishlist((ids) => (Array.isArray(ids) ? ids : []).filter((x) => x !== id)),
    [setWishlist],
  );
  const wishlist = useMemo(() => wishlistIds.map((id) => byId.get(id)).filter(Boolean), [wishlistIds]);

  const value = {
    cart,
    cartCount,
    subtotal,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    maxQty: MAX_QTY,
    wishlist,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    toasts,
    showToast,
    dismissToast,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
