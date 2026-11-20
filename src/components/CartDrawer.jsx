import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useModal } from '../hooks/useModal';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '../utils/format';
import CartLine from './CartLine';
import { BagIcon, CloseIcon } from './Icons';
import './Cart.css';

export function FreeShippingMeter({ subtotal }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div className="ship-meter">
      <p>
        {remaining > 0 ? (
          <>
            You are <strong>{formatPrice(remaining)}</strong> away from complimentary shipping.
          </>
        ) : (
          <>Your order qualifies for complimentary shipping.</>
        )}
      </p>
      <div className="ship-meter__track" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { cart, cartCount, subtotal, cartOpen, setCartOpen } = useStore();
  const navigate = useNavigate();
  const close = () => setCartOpen(false);
  const ref = useModal(cartOpen, close);

  if (!cartOpen) return null;

  return (
    <>
      <div className="overlay" onClick={close} aria-hidden="true" />
      <div
        ref={ref}
        className="drawer drawer--right cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        tabIndex={-1}
      >
        <div className="drawer__head">
          <h2 id="cart-drawer-title" className="drawer__title">
            Your bag {cartCount > 0 && <span className="muted">({cartCount})</span>}
          </h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close bag">
            <CloseIcon />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="drawer__body">
            <div className="empty-state">
              <span className="empty-state__icon">
                <BagIcon />
              </span>
              <h3 className="h3">Your bag is empty</h3>
              <p>Pieces you add will appear here. Start with the new season edit.</p>
              <Link to="/shop?sort=newest&filter=new" className="btn btn--primary" onClick={close}>
                Shop new arrivals
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="drawer__body">
              <div className="cart-drawer__meter">
                <FreeShippingMeter subtotal={subtotal} />
              </div>
              <ul role="list" className="cart-lines">
                {cart.map((item) => (
                  <CartLine key={item.key} item={item} onNavigate={close} />
                ))}
              </ul>
            </div>
            <div className="drawer__foot">
              <div className="cart-drawer__row">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p className="cart-drawer__note">Shipping and taxes calculated at checkout.</p>
              <div className="cart-drawer__ctas">
                <button
                  type="button"
                  className="btn btn--primary btn--block"
                  onClick={() => {
                    close();
                    navigate('/checkout');
                  }}
                >
                  Checkout
                </button>
                <Link to="/cart" className="btn btn--outline btn--block" onClick={close}>
                  View bag
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
