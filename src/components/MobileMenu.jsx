import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useModal } from '../hooks/useModal';
import { categories, collections } from '../data/products';
import { ArrowRight, CloseIcon, HeartIcon, SearchIcon } from './Icons';
import './MobileMenu.css';

export default function MobileMenu() {
  const { menuOpen, setMenuOpen, setSearchOpen, wishlist } = useStore();
  const close = () => setMenuOpen(false);
  const ref = useModal(menuOpen, close);

  if (!menuOpen) return null;

  return (
    <>
      <div className="overlay" onClick={close} aria-hidden="true" />
      <div
        ref={ref}
        className="drawer drawer--left mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
      >
        <div className="drawer__head">
          <span className="drawer__title">Menu</span>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <div className="drawer__body">
          <button
            type="button"
            className="mobile-menu__search"
            onClick={() => {
              close();
              setSearchOpen(true);
            }}
          >
            <SearchIcon size={20} />
            Search products, categories…
          </button>

          <nav aria-label="Mobile">
            <ul role="list" className="mobile-menu__primary">
              <li>
                <Link to="/shop?sort=newest&filter=new">New In</Link>
              </li>
              <li>
                <Link to="/shop">Shop All</Link>
              </li>
              <li>
                <Link to="/shop?filter=bestsellers">Best Sellers</Link>
              </li>
            </ul>

            <p className="eyebrow mobile-menu__label">Categories</p>
            <ul role="list" className="mobile-menu__list">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/shop?category=${c.slug}`}>
                    {c.name}
                    <ArrowRight size={16} />
                  </Link>
                </li>
              ))}
            </ul>

            <p className="eyebrow mobile-menu__label">Collections</p>
            <ul role="list" className="mobile-menu__list">
              {collections.map((c) => (
                <li key={c.slug}>
                  <Link to={`/shop?collection=${c.slug}`}>
                    {c.name}
                    <ArrowRight size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="drawer__foot mobile-menu__foot">
          <Link to="/wishlist" className="mobile-menu__wish">
            <HeartIcon size={20} />
            Wishlist {wishlist.length > 0 && <span>({wishlist.length})</span>}
          </Link>
          <p className="muted">Portfolio demo store</p>
        </div>
      </div>
    </>
  );
}
