import { useId, useState } from 'react';
import { CheckIcon } from './Icons';
import './Newsletter.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const id = useId();

  const submit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address, e.g. name@example.com');
      return;
    }
    setError('');
    setDone(true); // Demo only: nothing is sent or stored.
  };

  return (
    <section className="newsletter" aria-labelledby={`${id}-title`}>
      <div className="newsletter__media media">
        <img
          src="/images/editorial/newsletter-700.webp"
          width="700"
          height="875"
          alt="Flat lay of a white tee, grey jeans and suede ankle boots"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="newsletter__content">
        <p className="eyebrow">The NOVA Letter</p>
        <h2 id={`${id}-title`} className="h2">
          First access, <em className="serif-italic">quietly.</em>
        </h2>
        <p className="lead">
          New collections, restocks and studio notes — once or twice a month. Join for 10% off your first order.
        </p>

        {done ? (
          <div className="newsletter__success" role="status">
            <span className="newsletter__check">
              <CheckIcon size={18} />
            </span>
            <div>
              <p className="newsletter__success-title">You&rsquo;re on the list.</p>
              <p className="muted">Demo only — no email was sent or stored.</p>
            </div>
          </div>
        ) : (
          <form className="newsletter__form" onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor={`${id}-email`}>Email address</label>
              <div className="newsletter__row">
                <input
                  id={`${id}-email`}
                  className="input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${id}-err` : `${id}-hint`}
                />
                <button type="submit" className="btn btn--primary">
                  Subscribe
                </button>
              </div>
              {error ? (
                <p id={`${id}-err`} className="field-error" role="alert">
                  {error}
                </p>
              ) : (
                <p id={`${id}-hint`} className="newsletter__hint">
                  Unsubscribe at any time. This is a demo — your email isn&rsquo;t collected.
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
