import { useState } from 'react';
import { Link } from 'react-router-dom';
import Price from '../components/Price';
import { CloseIcon, HeartIcon } from '../components/Icons';
import { useStore } from '../context/StoreContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { getCategory } from '../data/products';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlist } = useStore();
  useDocumentMeta({ title: 'Wishlist', path: '/wishlist' });

  return (
    <div className="container wishlist">
      <header className="wishlist__head">
        <h1 className="h1">Wishlist</h1>
        {wishlist.length > 0 && (
          <p className="muted">
            {wishlist.length} saved {wishlist.length === 1 ? 'piece' : 'pieces'} · saved on this device
          </p>
        )}
      </header>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">
            <HeartIcon />
          </span>
          <h2 className="h3">Nothing saved yet</h2>
          <p>Tap the heart on any piece to keep it here for later. Your wishlist is saved in this browser.</p>
          <Link to="/shop" className="btn btn--primary">
            Discover the collection
          </Link>
        </div>
      ) : (
        <ul role="list" className="wishlist__grid">
          {wishlist.map((p) => (
            <WishlistItem key={p.id} product={p} />
          ))}
        </ul>
      )}
    </div>
  );
}

function WishlistItem({ product }) {
  const { removeFromWishlist, addToCart } = useStore();
  const oneSize = product.sizes.length === 1;
  const available = product.sizes.filter((s) => !product.unavailableSizes.includes(s));
  const [size, setSize] = useState(oneSize ? product.sizes[0] : '');
  const [error, setError] = useState('');
  const url = `/product/${product.slug}`;
  const selectId = `wl-size-${product.id}`;

  const moveToCart = () => {
    if (!size) {
      setError('Select a size first');
      return;
    }
    addToCart(product, { color: product.colors[0].name, size });
    removeFromWishlist(product.id);
  };

  return (
    <li className="wl-item">
      <div className="wl-item__media media">
        <Link to={url} tabIndex={-1} aria-hidden="true">
          <img src={product.images[0].sm} alt="" width="600" height="750" loading="lazy" decoding="async" />
        </Link>
        <button
          type="button"
          className="wl-item__remove"
          onClick={() => removeFromWishlist(product.id)}
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <CloseIcon size={18} />
        </button>
      </div>
      <div className="wl-item__info">
        <p className="pcard__cat">{getCategory(product.category)?.name}</p>
        <h2 className="pcard__name">
          <Link to={url}>{product.name}</Link>
        </h2>
        <Price price={product.price} originalPrice={product.originalPrice} />
      </div>
      <div className="wl-item__actions">
        {!oneSize && (
          <div className="field">
            <label htmlFor={selectId} className="visually-hidden">
              Size for {product.name}
            </label>
            <select
              id={selectId}
              className="select wl-item__select"
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                setError('');
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${selectId}-err` : undefined}
            >
              <option value="">Select size</option>
              {product.sizes.map((s) => (
                <option key={s} value={s} disabled={!available.includes(s)}>
                  {s}
                  {available.includes(s) ? '' : ' — sold out'}
                </option>
              ))}
            </select>
            {error && (
              <p id={`${selectId}-err`} className="field-error" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
        <button type="button" className="btn btn--primary btn--block" onClick={moveToCart}>
          Move to bag
        </button>
      </div>
    </li>
  );
}
