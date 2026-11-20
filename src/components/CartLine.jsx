import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/format';
import QuantityControl from './QuantityControl';
import './Cart.css';

export default function CartLine({ item, onNavigate, large = false }) {
  const { updateQty, removeFromCart, maxQty } = useStore();
  const { product, color, size, qty, key } = item;
  const url = `/product/${product.slug}`;

  return (
    <li className={`cart-line ${large ? 'cart-line--lg' : ''}`}>
      <Link to={url} className="cart-line__media media" onClick={onNavigate} tabIndex={-1} aria-hidden="true">
        <img src={product.images[0].sm} alt="" width="600" height="750" loading="lazy" decoding="async" />
      </Link>
      <div className="cart-line__info">
        <div className="cart-line__top">
          <h3 className="cart-line__name">
            <Link to={url} onClick={onNavigate}>
              {product.name}
            </Link>
          </h3>
          <p className="cart-line__total">{formatPrice(product.price * qty)}</p>
        </div>
        <dl className="cart-line__meta">
          <div>
            <dt>Colour</dt>
            <dd>{color}</dd>
          </div>
          <div>
            <dt>Size</dt>
            <dd>{size}</dd>
          </div>
          {qty > 1 && (
            <div>
              <dt>Each</dt>
              <dd>{formatPrice(product.price)}</dd>
            </div>
          )}
        </dl>
        <div className="cart-line__actions">
          <QuantityControl
            value={qty}
            min={1}
            max={maxQty}
            size="sm"
            label={`Quantity for ${product.name}`}
            onChange={(n) => updateQty(key, n)}
          />
          <button type="button" className="cart-line__remove" onClick={() => removeFromCart(key)}>
            Remove<span className="visually-hidden"> {product.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
