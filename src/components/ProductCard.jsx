import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getCategory } from '../data/products';
import { srcSet } from '../utils/format';
import WishlistButton from './WishlistButton';
import Price from './Price';
import { CloseIcon, PlusIcon } from './Icons';
import './ProductCard.css';

const CARD_SIZES = '(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw';

export default function ProductCard({ product, priority = false }) {
  const { addToCart } = useStore();
  const [picking, setPicking] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const url = `/product/${product.slug}`;
  const [primary, secondary] = product.images;
  const onSale = product.originalPrice > product.price;
  const color = product.colors[0].name;

  const quickAdd = () => {
    if (product.sizes.length === 1) {
      addToCart(product, { color, size: product.sizes[0] });
    } else {
      setPicking(true);
    }
  };

  const pickSize = (size) => {
    addToCart(product, { color, size });
    setPicking(false);
  };

  return (
    <article className="pcard">
      <div className={`pcard__media media ${picking ? 'is-picking' : ''}`}>
        <Link to={url} className="pcard__img-link" tabIndex={-1} aria-hidden="true">
          <img
            className={`pcard__img img-fade ${loaded ? 'is-loaded' : ''}`}
            src={primary.sm}
            srcSet={srcSet(primary)}
            sizes={CARD_SIZES}
            width="600"
            height="750"
            alt=""
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
          {secondary && (
            <img
              className="pcard__img pcard__img--alt"
              src={secondary.sm}
              srcSet={srcSet(secondary)}
              sizes={CARD_SIZES}
              width="600"
              height="750"
              alt=""
              loading="lazy"
              decoding="async"
            />
          )}
        </Link>

        <div className="pcard__badges">
          {product.newArrival && <span className="badge">New</span>}
          {onSale && (
            <span className="badge badge--sale">
              −{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        <WishlistButton product={product} className="pcard__wish" />

        {!picking && (
          <button
            type="button"
            className="pcard__quick"
            onClick={quickAdd}
            aria-label={`Quick add ${product.name} to bag`}
          >
            <PlusIcon size={18} />
            <span className="pcard__quick-label">Quick add</span>
          </button>
        )}

        {picking && (
          <div className="pcard__sizes" role="group" aria-label={`Select a size for ${product.name}`}>
            <div className="pcard__sizes-head">
              <span>Select size</span>
              <button type="button" className="pcard__sizes-close" onClick={() => setPicking(false)} aria-label="Close size selector">
                <CloseIcon size={16} />
              </button>
            </div>
            <div className="pcard__sizes-list">
              {product.sizes.map((size) => {
                const unavailable = product.unavailableSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    className="pcard__size"
                    disabled={unavailable}
                    aria-label={unavailable ? `${size}, sold out` : `Add size ${size}`}
                    onClick={() => pickSize(size)}
                    autoFocus={size === product.sizes.find((s) => !product.unavailableSizes.includes(s))}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="pcard__info">
        <p className="pcard__cat">{getCategory(product.category)?.name}</p>
        <h3 className="pcard__name">
          <Link to={url}>{product.name}</Link>
        </h3>
        <Price price={product.price} originalPrice={product.originalPrice} className="pcard__price" />
        {product.colors.length > 1 && (
          <p className="pcard__colors">
            <span className="pcard__swatches" aria-hidden="true">
              {product.colors.map((c) => (
                <span key={c.name} style={{ background: c.hex }} />
              ))}
            </span>
            <span>{product.colors.length} colours</span>
          </p>
        )}
      </div>
    </article>
  );
}
