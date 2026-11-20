import { Link } from 'react-router-dom';
import CartLine from '../components/CartLine';
import { FreeShippingMeter } from '../components/CartDrawer';
import ProductGrid from '../components/ProductGrid';
import { BagIcon, LockIcon } from '../components/Icons';
import { useStore } from '../context/StoreContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { bestSellers } from '../data/products';
import { formatPrice, shippingCost } from '../utils/format';
import './Cart.css';

export default function Cart() {
  const { cart, cartCount, subtotal } = useStore();
  useDocumentMeta({ title: 'Your Bag', path: '/cart' });

  const shipping = shippingCost(subtotal, 'standard');
  const total = subtotal + shipping;
  const inCart = new Set(cart.map((i) => i.productId));
  const suggestions = bestSellers().filter((p) => !inCart.has(p.id)).slice(0, 4);

  return (
    <div className="container cart-page">
      <header className="cart-page__head">
        <h1 className="h1">Your Bag</h1>
        {cartCount > 0 && (
          <p className="muted">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </p>
        )}
      </header>

      {cart.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">
            <BagIcon />
          </span>
          <h2 className="h3">Your bag is empty</h2>
          <p>Looks like you haven&rsquo;t added anything yet. Discover the new season or revisit your wishlist.</p>
          <div className="cart-page__empty-ctas">
            <Link to="/shop" className="btn btn--primary">
              Continue shopping
            </Link>
            <Link to="/wishlist" className="btn btn--outline">
              View wishlist
            </Link>
          </div>
        </div>
      ) : (
        <div className="cart-page__grid">
          <section aria-label="Items in your bag">
            <ul role="list" className="cart-lines cart-page__lines">
              {cart.map((item) => (
                <CartLine key={item.key} item={item} large />
              ))}
            </ul>
            <Link to="/shop" className="link-underline cart-page__continue">
              Continue shopping
            </Link>
          </section>

          <aside className="summary" aria-labelledby="summary-title">
            <h2 id="summary-title" className="summary__title">
              Order summary
            </h2>
            <FreeShippingMeter subtotal={subtotal} />
            <dl className="summary__rows">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? 'Free' : `From ${formatPrice(shipping)}`}</dd>
              </div>
              <div>
                <dt>Estimated tax</dt>
                <dd className="muted">Calculated at checkout</dd>
              </div>
              <div className="summary__total">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className="btn btn--primary btn--block">
              <LockIcon size={16} /> Proceed to checkout
            </Link>
            <p className="summary__note">Demo store — checkout is a UI prototype and no payment is taken.</p>
          </aside>
        </div>
      )}

      {suggestions.length > 0 && (
        <section className="section--tight cart-page__suggest" aria-labelledby="suggest-title">
          <h2 id="suggest-title" className="h2 cart-page__suggest-title">
            Most loved right now
          </h2>
          <ProductGrid products={suggestions} columns={4} />
        </section>
      )}
    </div>
  );
}
