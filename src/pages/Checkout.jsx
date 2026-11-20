import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BagIcon, CheckIcon, ChevronDown, LockIcon } from '../components/Icons';
import { useStore } from '../context/StoreContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { SHIPPING_METHODS, formatPrice, shippingCost } from '../utils/format';
import './Cart.css';
import './Checkout.css';

const STEPS = ['Contact', 'Shipping', 'Payment', 'Review'];

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'France',
  'Germany',
  'Italy',
  'Netherlands',
  'Spain',
  'Sweden',
  'Ireland',
  'Japan',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ---------- Validation rules per step ---------- */
const rules = {
  email: (v) => (!v.trim() ? 'Enter your email address' : !EMAIL_RE.test(v.trim()) ? 'Enter a valid email, e.g. name@example.com' : ''),
  firstName: (v) => (v.trim() ? '' : 'Enter your first name'),
  lastName: (v) => (v.trim() ? '' : 'Enter your last name'),
  address: (v) => (v.trim().length >= 5 ? '' : 'Enter your street address'),
  city: (v) => (v.trim() ? '' : 'Enter your city'),
  postalCode: (v) => (/^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/.test(v.trim()) ? '' : 'Enter a valid postal code'),
  country: (v) => (v ? '' : 'Select your country'),
  phone: (v) => (/^\+?[0-9\s().-]{7,20}$/.test(v.trim()) ? '' : 'Enter a valid phone number'),
  cardName: (v) => (v.trim() ? '' : 'Enter the name on the card'),
  cardNumber: (v) => (v.replace(/\s/g, '').length === 16 ? '' : 'Card number should be 16 digits'),
  expiry: (v) => {
    const m = v.match(/^(\d{2})\s?\/\s?(\d{2})$/);
    if (!m) return 'Use the format MM / YY';
    const month = Number(m[1]);
    return month >= 1 && month <= 12 ? '' : 'Enter a valid month';
  },
  cvc: (v) => (/^\d{3,4}$/.test(v) ? '' : 'CVC should be 3 or 4 digits'),
};

const STEP_FIELDS = [
  ['email'],
  ['firstName', 'lastName', 'address', 'city', 'postalCode', 'country', 'phone'],
  ['cardName', 'cardNumber', 'expiry', 'cvc'],
  [],
];

const initialForm = {
  email: '',
  marketing: false,
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  postalCode: '',
  country: 'United States',
  phone: '',
  shipping: 'standard',
  // Payment fields are DEMO ONLY: kept in memory for this page, never persisted or transmitted.
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

const formatCard = (v) =>
  v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
};

export default function Checkout() {
  useDocumentMeta({ title: 'Checkout', path: '/checkout' });
  const { cart, subtotal, clearCart } = useStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [order, setOrder] = useState(null);
  const [placing, setPlacing] = useState(false);
  const formRef = useRef(null);
  const headingRef = useRef(null);

  const shipping = shippingCost(subtotal, form.shipping);
  const total = subtotal + shipping;

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, order]);

  if (order) return <Confirmation order={order} headingRef={headingRef} />;

  if (cart.length === 0) {
    return (
      <div className="container empty-state checkout-empty">
        <span className="empty-state__icon">
          <BagIcon />
        </span>
        <h1 className="h3">Your bag is empty</h1>
        <p>Add a few pieces before heading to checkout.</p>
        <Link to="/shop" className="btn btn--primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (touched[name] && rules[name]) setErrors((e) => ({ ...e, [name]: rules[name](value) }));
  };

  const blur = (name) => {
    setTouched((t) => ({ ...t, [name]: true }));
    if (rules[name]) setErrors((e) => ({ ...e, [name]: rules[name](form[name]) }));
  };

  const validateStep = (i) => {
    const stepErrors = {};
    STEP_FIELDS[i].forEach((name) => {
      const msg = rules[name](form[name]);
      if (msg) stepErrors[name] = msg;
    });
    setErrors((e) => ({ ...e, ...Object.fromEntries(STEP_FIELDS[i].map((n) => [n, stepErrors[n] ?? ''])) }));
    setTouched((t) => ({ ...t, ...Object.fromEntries(STEP_FIELDS[i].map((n) => [n, true])) }));
    const first = STEP_FIELDS[i].find((n) => stepErrors[n]);
    if (first) formRef.current?.querySelector(`[name="${first}"]`)?.focus();
    return !first;
  };

  const next = (e) => {
    e.preventDefault();
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const placeOrder = () => {
    for (let i = 0; i < 3; i += 1) {
      if (!validateStep(i)) {
        setStep(i);
        return;
      }
    }
    setPlacing(true);
    // Simulated latency only — nothing is sent anywhere.
    window.setTimeout(() => {
      setOrder({
        number: `NW-${Math.floor(100000 + Math.random() * 900000)}`,
        email: form.email,
        name: form.firstName,
        items: cart.reduce((n, i) => n + i.qty, 0),
        total,
        method: SHIPPING_METHODS.find((m) => m.id === form.shipping),
      });
      clearCart();
      setForm(initialForm); // wipe demo card data from memory
      setPlacing(false);
    }, 900);
  };

  const fieldProps = (name, extra = {}) => ({
    id: `co-${name}`,
    name,
    className: 'input',
    value: form[name],
    onChange: (e) => set(name, e.target.value),
    onBlur: () => blur(name),
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `co-${name}-err` : undefined,
    ...extra,
  });

  const Field = ({ name, label, optional, children, className = '' }) => (
    <div className={`field ${className}`}>
      <label htmlFor={`co-${name}`}>
        {label} {optional && <span className="muted">(optional)</span>}
      </label>
      {children}
      {errors[name] && (
        <p id={`co-${name}-err`} className="field-error">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="checkout container">
      <div className="checkout__grid">
        <div className="checkout__main">
          <ol className="stepper" aria-label="Checkout progress">
            {STEPS.map((label, i) => {
              const state = i < step ? 'done' : i === step ? 'current' : 'todo';
              return (
                <li key={label} className={`stepper__item is-${state}`}>
                  {i < step ? (
                    <button type="button" onClick={() => setStep(i)} className="stepper__btn">
                      <span className="stepper__num">
                        <CheckIcon size={12} />
                      </span>
                      <span className="stepper__label">{label}</span>
                      <span className="visually-hidden">(completed, edit)</span>
                    </button>
                  ) : (
                    <span className="stepper__btn" aria-current={i === step ? 'step' : undefined}>
                      <span className="stepper__num">{i + 1}</span>
                      <span className="stepper__label">{label}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          <MobileSummary cart={cart} subtotal={subtotal} shipping={shipping} total={total} />

          <form ref={formRef} className="checkout__form" onSubmit={next} noValidate>
            {step === 0 && (
              <section aria-labelledby="step-title" className="checkout__step">
                <h1 id="step-title" ref={headingRef} tabIndex={-1} className="checkout__title">
                  Contact
                </h1>
                <p className="muted">We&rsquo;ll send your order confirmation here.</p>
                {Field({
                  name: 'email',
                  label: 'Email address',
                  children: <input {...fieldProps('email', { type: 'email', inputMode: 'email', autoComplete: 'email' })} />,
                })}
                <label className="checkbox">
                  <input type="checkbox" checked={form.marketing} onChange={(e) => set('marketing', e.target.checked)} />
                  Email me about new collections and restocks
                </label>
              </section>
            )}

            {step === 1 && (
              <section aria-labelledby="step-title" className="checkout__step">
                <h1 id="step-title" ref={headingRef} tabIndex={-1} className="checkout__title">
                  Shipping address
                </h1>
                <div className="form-grid">
                  {Field({ name: 'firstName', label: 'First name', children: <input {...fieldProps('firstName', { autoComplete: 'given-name' })} /> })}
                  {Field({ name: 'lastName', label: 'Last name', children: <input {...fieldProps('lastName', { autoComplete: 'family-name' })} /> })}
                  {Field({
                    name: 'address',
                    label: 'Address',
                    className: 'span-2',
                    children: <input {...fieldProps('address', { autoComplete: 'address-line1' })} />,
                  })}
                  {Field({
                    name: 'apartment',
                    label: 'Apartment, suite, etc.',
                    optional: true,
                    className: 'span-2',
                    children: (
                      <input
                        id="co-apartment"
                        name="apartment"
                        className="input"
                        autoComplete="address-line2"
                        value={form.apartment}
                        onChange={(e) => set('apartment', e.target.value)}
                      />
                    ),
                  })}
                  {Field({ name: 'city', label: 'City', children: <input {...fieldProps('city', { autoComplete: 'address-level2' })} /> })}
                  {Field({
                    name: 'postalCode',
                    label: 'Postal code',
                    children: <input {...fieldProps('postalCode', { autoComplete: 'postal-code' })} />,
                  })}
                  {Field({
                    name: 'country',
                    label: 'Country',
                    children: (
                      <select {...fieldProps('country', { className: 'select', autoComplete: 'country-name' })}>
                        {COUNTRIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    ),
                  })}
                  {Field({
                    name: 'phone',
                    label: 'Phone',
                    children: <input {...fieldProps('phone', { type: 'tel', inputMode: 'tel', autoComplete: 'tel' })} />,
                  })}
                </div>

                <fieldset className="ship-methods">
                  <legend className="checkout__subtitle">Delivery method</legend>
                  {SHIPPING_METHODS.map((m) => {
                    const cost = shippingCost(subtotal, m.id);
                    return (
                      <label key={m.id} className={`ship-method ${form.shipping === m.id ? 'is-active' : ''}`}>
                        <input
                          type="radio"
                          name="shipping"
                          value={m.id}
                          checked={form.shipping === m.id}
                          onChange={() => set('shipping', m.id)}
                        />
                        <span className="ship-method__text">
                          <strong>{m.label}</strong>
                          <span className="muted">{m.eta}</span>
                        </span>
                        <span className="ship-method__price">{cost === 0 ? 'Free' : formatPrice(cost)}</span>
                      </label>
                    );
                  })}
                </fieldset>
              </section>
            )}

            {step === 2 && (
              <section aria-labelledby="step-title" className="checkout__step">
                <h1 id="step-title" ref={headingRef} tabIndex={-1} className="checkout__title">
                  Payment
                </h1>
                <div className="demo-banner" role="note">
                  <strong>DEMO ONLY — no payment is processed.</strong>
                  <span>
                    Do not enter real card details. Card fields are validated for format only, never saved and never
                    sent anywhere.
                  </span>
                  <button
                    type="button"
                    className="demo-banner__fill"
                    onClick={() => {
                      setForm((f) => ({
                        ...f,
                        cardName: `${f.firstName} ${f.lastName}`.trim() || 'Demo Customer',
                        cardNumber: '4242 4242 4242 4242',
                        expiry: '12 / 29',
                        cvc: '123',
                      }));
                      setErrors((e) => ({ ...e, cardName: '', cardNumber: '', expiry: '', cvc: '' }));
                    }}
                  >
                    Fill with demo card
                  </button>
                </div>

                <div className="form-grid card-fields">
                  {Field({
                    name: 'cardName',
                    label: 'Name on card',
                    className: 'span-2',
                    children: <input {...fieldProps('cardName', { autoComplete: 'off' })} />,
                  })}
                  {Field({
                    name: 'cardNumber',
                    label: 'Card number (demo)',
                    className: 'span-2',
                    children: (
                      <input
                        {...fieldProps('cardNumber', {
                          inputMode: 'numeric',
                          autoComplete: 'off',
                          placeholder: '4242 4242 4242 4242',
                          onChange: (e) => set('cardNumber', formatCard(e.target.value)),
                        })}
                      />
                    ),
                  })}
                  {Field({
                    name: 'expiry',
                    label: 'Expiry (MM / YY)',
                    children: (
                      <input
                        {...fieldProps('expiry', {
                          inputMode: 'numeric',
                          autoComplete: 'off',
                          placeholder: 'MM / YY',
                          onChange: (e) => set('expiry', formatExpiry(e.target.value)),
                        })}
                      />
                    ),
                  })}
                  {Field({
                    name: 'cvc',
                    label: 'CVC',
                    children: (
                      <input
                        {...fieldProps('cvc', {
                          inputMode: 'numeric',
                          autoComplete: 'off',
                          placeholder: '123',
                          maxLength: 4,
                          onChange: (e) => set('cvc', e.target.value.replace(/\D/g, '').slice(0, 4)),
                        })}
                      />
                    ),
                  })}
                </div>
              </section>
            )}

            {step === 3 && (
              <section aria-labelledby="step-title" className="checkout__step">
                <h1 id="step-title" ref={headingRef} tabIndex={-1} className="checkout__title">
                  Review your order
                </h1>
                <dl className="review">
                  <ReviewRow label="Contact" onEdit={() => setStep(0)}>
                    {form.email}
                  </ReviewRow>
                  <ReviewRow label="Ship to" onEdit={() => setStep(1)}>
                    {form.firstName} {form.lastName}
                    <br />
                    {form.address}
                    {form.apartment && `, ${form.apartment}`}
                    <br />
                    {form.city} {form.postalCode}, {form.country}
                    <br />
                    {form.phone}
                  </ReviewRow>
                  <ReviewRow label="Delivery" onEdit={() => setStep(1)}>
                    {SHIPPING_METHODS.find((m) => m.id === form.shipping).label} ·{' '}
                    {SHIPPING_METHODS.find((m) => m.id === form.shipping).eta} ·{' '}
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </ReviewRow>
                  <ReviewRow label="Payment" onEdit={() => setStep(2)}>
                    Demo card ending {form.cardNumber.slice(-4)}
                  </ReviewRow>
                </dl>
                <ul role="list" className="review__items">
                  {cart.map((item) => (
                    <li key={item.key}>
                      <img src={item.product.images[0].sm} alt="" width="56" height="70" />
                      <span>
                        {item.product.name}
                        <span className="muted">
                          {' '}
                          — {item.color}, {item.size} × {item.qty}
                        </span>
                      </span>
                      <span>{formatPrice(item.product.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="checkout__actions">
              {step > 0 ? (
                <button type="button" className="btn btn--outline" onClick={() => setStep((s) => s - 1)}>
                  Back
                </button>
              ) : (
                <Link to="/cart" className="btn btn--outline">
                  Back to bag
                </Link>
              )}
              {step < 3 ? (
                <button type="submit" className="btn btn--primary">
                  Continue to {STEPS[step + 1].toLowerCase()}
                </button>
              ) : (
                <button type="button" className="btn btn--primary" onClick={placeOrder} disabled={placing} aria-busy={placing}>
                  <LockIcon size={16} />
                  {placing ? 'Placing order…' : `Place demo order · ${formatPrice(total)}`}
                </button>
              )}
            </div>
          </form>
        </div>

        <aside className="checkout__aside" aria-label="Order summary">
          <OrderSummary cart={cart} subtotal={subtotal} shipping={shipping} total={total} />
        </aside>
      </div>
    </div>
  );
}

function ReviewRow({ label, onEdit, children }) {
  return (
    <div className="review__row">
      <dt>{label}</dt>
      <dd>{children}</dd>
      <dd className="review__edit">
        <button type="button" className="text-link" onClick={onEdit}>
          Edit<span className="visually-hidden"> {label}</span>
        </button>
      </dd>
    </div>
  );
}

function OrderSummary({ cart, subtotal, shipping, total }) {
  return (
    <div className="summary">
      <h2 className="summary__title">Order summary</h2>
      <ul role="list" className="sum-items">
        {cart.map((item) => (
          <li key={item.key} className="sum-item">
            <span className="sum-item__media media">
              <img src={item.product.images[0].sm} alt="" width="600" height="750" loading="lazy" />
              <span className="sum-item__qty" aria-label={`Quantity ${item.qty}`}>
                {item.qty}
              </span>
            </span>
            <span className="sum-item__info">
              <span>{item.product.name}</span>
              <span className="muted">
                {item.color} · {item.size}
              </span>
            </span>
            <span className="sum-item__price">{formatPrice(item.product.price * item.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="summary__rows">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
        </div>
        <div>
          <dt>Tax</dt>
          <dd className="muted">$0 (demo)</dd>
        </div>
        <div className="summary__total">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
    </div>
  );
}

function MobileSummary(props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="m-summary">
      <button type="button" className="m-summary__toggle" aria-expanded={open} aria-controls="m-summary-panel" onClick={() => setOpen((o) => !o)}>
        <span>
          {open ? 'Hide' : 'Show'} order summary <ChevronDown size={16} className={open ? 'is-flipped' : ''} />
        </span>
        <strong>{formatPrice(props.total)}</strong>
      </button>
      <div id="m-summary-panel" hidden={!open}>
        <OrderSummary {...props} />
      </div>
    </div>
  );
}

function Confirmation({ order, headingRef }) {
  return (
    <div className="container confirm">
      <span className="confirm__icon">
        <CheckIcon size={28} />
      </span>
      <p className="eyebrow">Order {order.number}</p>
      <h1 ref={headingRef} tabIndex={-1} className="h1">
        Thank you, {order.name}.
      </h1>
      <p className="lead">
        Your demo order of {order.items} {order.items === 1 ? 'item' : 'items'} ({formatPrice(order.total)}) has been
        placed. In a real store, a confirmation would be sent to <strong>{order.email}</strong> and your parcel would
        arrive via {order.method.label.toLowerCase()} delivery in {order.method.eta}.
      </p>
      <p className="confirm__demo">This is a portfolio demo — no payment was taken and nothing will be shipped.</p>
      <Link to="/shop" className="btn btn--primary">
        Continue shopping
      </Link>
    </div>
  );
}
