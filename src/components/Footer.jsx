import { Link } from 'react-router-dom';
import { categories, collections } from '../data/products';
import { Logo } from './Header';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Logo className="logo--light" />
            <p className="site-footer__tagline serif-italic">Modern Essentials. Elevated.</p>
            <p className="site-footer__about">
              Fewer, better pieces — designed in neutral palettes and natural fibres, made to be worn for years.
            </p>
          </div>

          <nav className="site-footer__cols" aria-label="Footer">
            <div>
              <h2 className="site-footer__heading">Shop</h2>
              <ul role="list">
                <li><Link to="/shop?sort=newest&filter=new">New In</Link></li>
                {categories.slice(0, 5).map((c) => (
                  <li key={c.slug}>
                    <Link to={`/shop?category=${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="site-footer__heading">Collections</h2>
              <ul role="list">
                {collections.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/shop?collection=${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="site-footer__heading">Help</h2>
              <ul role="list">
                <li><Link to="/cart">Your Bag</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><Link to="/checkout">Checkout</Link></li>
              </ul>
              <p className="site-footer__note">
                Free standard shipping over $150. Returns accepted within 30 days, unworn with tags.
              </p>
            </div>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} NOVA WEAR. A fictional brand created as a portfolio concept.</p>
          <p>
            Demo only — no real products, orders or payments. Photography via{' '}
            <a className="text-link" href="https://unsplash.com" target="_blank" rel="noreferrer">
              Unsplash
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
