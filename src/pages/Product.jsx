import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductGallery from '../components/ProductGallery';
import ColorSelector from '../components/ColorSelector';
import SizeSelector from '../components/SizeSelector';
import SizeGuide from '../components/SizeGuide';
import QuantityControl from '../components/QuantityControl';
import WishlistButton from '../components/WishlistButton';
import ProductGrid from '../components/ProductGrid';
import Price from '../components/Price';
import { ChevronDown, LeafIcon, ReturnIcon, TruckIcon } from '../components/Icons';
import { useStore } from '../context/StoreContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { getCategory, getCollection, getProductBySlug, getRelated } from '../data/products';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '../utils/format';
import NotFound from './NotFound';
import './Product.css';

export default function Product() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  if (!product) return <NotFound />;
  // Keyed so all selection state resets when moving between products.
  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }) {
  const { addToCart, maxQty } = useStore();
  const oneSize = product.sizes.length === 1;
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState(oneSize ? product.sizes[0] : '');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [guideOpen, setGuideOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const buyRef = useRef(null);
  const sizesRef = useRef(null);

  const category = getCategory(product.category);
  const collection = getCollection(product.collection);
  const related = getRelated(product, 4);

  useDocumentMeta({
    title: `${product.name} — ${formatPrice(product.price)}`,
    description: `${product.name}. ${product.description}`.slice(0, 160),
    image: product.images[0].lg,
    path: `/product/${product.slug}`,
  });

  // Show the sticky mobile bar once the main Add to Bag button scrolls out of view.
  useEffect(() => {
    const el = buyRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleAdd = () => {
    if (!size) {
      setError('Please select a size to continue.');
      sizesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      sizesRef.current?.querySelector('input:not(:disabled)')?.focus({ preventScroll: true });
      return;
    }
    setError('');
    addToCart(product, { color, size, qty });
  };

  return (
    <article className="pdp">
      <div className="container">
        <nav className="breadcrumbs pdp__crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to={`/shop?category=${product.category}`}>{category?.name}</Link>
            </li>
            <li>
              <span aria-current="page">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="pdp__grid">
          <ProductGallery product={product} />

          <div className="pdp__info">
            <Link to={`/shop?collection=${collection.slug}`} className="eyebrow pdp__collection">
              {collection.name}
            </Link>
            <h1 className="pdp__name">{product.name}</h1>
            <div className="pdp__price-row">
              <Price price={product.price} originalPrice={product.originalPrice} className="pdp__price" />
              {product.originalPrice > product.price && (
                <span className="badge badge--sale">
                  Save {formatPrice(product.originalPrice - product.price)}
                </span>
              )}
            </div>
            <p className="pdp__desc">{product.description}</p>

            <div className="pdp__options">
              <ColorSelector colors={product.colors} value={color} onChange={setColor} />
              <div ref={sizesRef}>
                <SizeSelector
                  sizes={product.sizes}
                  unavailable={product.unavailableSizes}
                  value={size}
                  onChange={(s) => {
                    setSize(s);
                    setError('');
                  }}
                  onOpenGuide={() => setGuideOpen(true)}
                  error={error}
                />
              </div>
            </div>

            <div className="pdp__buy" ref={buyRef}>
              <QuantityControl value={qty} onChange={setQty} min={1} max={maxQty} />
              <button type="button" className="btn btn--primary pdp__add" onClick={handleAdd}>
                Add to bag — {formatPrice(product.price * qty)}
              </button>
            </div>
            <WishlistButton product={product} variant="full" className="btn--block pdp__wish" />

            <ul role="list" className="pdp__perks">
              <li>
                <TruckIcon size={20} />
                Free standard delivery over {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </li>
              <li>
                <ReturnIcon size={20} />
                Free 30-day returns
              </li>
              <li>
                <LeafIcon size={20} />
                {product.composition.split(',')[0]}
              </li>
            </ul>

            <div className="pdp__accordions">
              <details open>
                <summary>
                  Details &amp; fit <ChevronDown size={18} />
                </summary>
                <div className="pdp__acc-body">
                  <ul>
                    {product.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <p>{product.fit}</p>
                </div>
              </details>
              <details>
                <summary>
                  Composition &amp; care <ChevronDown size={18} />
                </summary>
                <div className="pdp__acc-body">
                  <p>{product.composition}</p>
                  <p>Cool wash or dry clean. Do not tumble dry. Reshape while damp and dry flat. Iron on low heat.</p>
                </div>
              </details>
              <details>
                <summary>
                  Delivery &amp; returns <ChevronDown size={18} />
                </summary>
                <div className="pdp__acc-body">
                  <p>
                    Standard delivery (3–5 business days) is $8, free on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
                    Express delivery (1–2 business days) is $18.
                  </p>
                  <p>Return unworn pieces with tags within 30 days for a full refund.</p>
                  <p className="muted">Demo store — no orders are shipped.</p>
                </div>
              </details>
            </div>
            <p className="pdp__sku">Ref. {product.id.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section container" aria-labelledby="related-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">Complete the look</p>
              <h2 id="related-title" className="h2">
                You may also like
              </h2>
            </div>
          </div>
          <ProductGrid products={related} columns={4} />
        </section>
      )}

      <div className={`sticky-buy ${showSticky ? 'is-visible' : ''}`} aria-hidden={!showSticky}>
        <img src={product.images[0].sm} alt="" width="48" height="60" />
        <div className="sticky-buy__info">
          <p className="sticky-buy__name">{product.name}</p>
          <p className="sticky-buy__meta">
            {formatPrice(product.price)} · {size ? `Size ${size}` : 'Select size'}
          </p>
        </div>
        <button type="button" className="btn btn--primary btn--sm" onClick={handleAdd} tabIndex={showSticky ? 0 : -1}>
          Add to bag
        </button>
      </div>

      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} denim={product.category === 'trousers-denim' && product.sizes[0] === '26'} />
    </article>
  );
}
