import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { BagIcon, ChevronLeft, HeartIcon, LockIcon, MenuIcon, SearchIcon } from './Icons';
import './Header.css';

export const NAV_LINKS = [
  { to: '/shop?sort=newest&filter=new', label: 'New In' },
  { to: '/shop', label: 'Shop All' },
  { to: '/shop?category=outerwear', label: 'Outerwear' },
  { to: '/shop?category=knitwear', label: 'Knitwear' },
  { to: '/shop?category=tailoring', label: 'Tailoring' },
];

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`logo ${className}`} aria-label="NOVA WEAR — home">
      NOVA<span>WEAR</span>
    </Link>
  );
}

export default function Header({ minimal = false }) {
  const { cartCount, wishlist, setCartOpen, setSearchOpen, setMenuOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (minimal) {
    return (
      <header className="site-header site-header--minimal is-scrolled">
        <div className="site-header__inner container">
          <Link to="/cart" className="header-back">
            <ChevronLeft size={18} />
            <span>Bag</span>
          </Link>
          <Logo />
          <span className="header-secure">
            <LockIcon size={16} />
            <span>Secure checkout</span>
          </span>
        </div>
      </header>
    );
  }

  return (
    <>
      <div className="announce" role="region" aria-label="Store announcement">
        <p>
          Free shipping over $150 <span aria-hidden="true">·</span> 30-day returns
        </p>
      </div>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="site-header__inner container">
          <div className="site-header__left">
            <button
              type="button"
              className="icon-btn hide-desktop"
              aria-label="Open menu"
              aria-haspopup="dialog"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </button>
            <button
              type="button"
              className="icon-btn hide-desktop"
              aria-label="Search"
              aria-haspopup="dialog"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </button>
            <nav className="primary-nav hide-mobile" aria-label="Primary">
              <ul role="list">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    <NavLink to={l.to} end className="primary-nav__link">
                      {l.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Logo />

          <div className="site-header__right">
            <button
              type="button"
              className="header-search hide-mobile"
              aria-haspopup="dialog"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon size={20} />
              <span>Search</span>
            </button>
            <Link to="/wishlist" className="icon-btn icon-btn--count" aria-label={`Wishlist, ${wishlist.length} items`}>
              <HeartIcon />
              {wishlist.length > 0 && <span className="count-dot" aria-hidden="true">{wishlist.length}</span>}
            </Link>
            <button
              type="button"
              className="icon-btn icon-btn--count"
              aria-label={`Shopping bag, ${cartCount} items`}
              aria-haspopup="dialog"
              onClick={() => setCartOpen(true)}
            >
              <BagIcon />
              {cartCount > 0 && <span className="count-dot" aria-hidden="true">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
