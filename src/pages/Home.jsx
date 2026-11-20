import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductRail from '../components/ProductRail';
import ProductGrid from '../components/ProductGrid';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import { ArrowRight, LeafIcon, ReturnIcon, TruckIcon } from '../components/Icons';
import { bestSellers, categories, newArrivals, products } from '../data/products';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import './Home.css';

const HOME_CATEGORIES = ['outerwear', 'knitwear', 'tailoring', 'shirts-tops', 'dresses-skirts', 'accessories'];

export default function Home() {
  useDocumentMeta({ path: '/' });

  const arrivals = newArrivals();
  const best = bestSellers().slice(0, 4);
  const autumn = products.filter((p) => p.collection === 'autumn-atelier' && p.featured).slice(0, 2);
  const homeCats = HOME_CATEGORIES.map((slug) => categories.find((c) => c.slug === slug));
  const countFor = (slug) => products.filter((p) => p.category === slug).length;

  return (
    <>
      <Hero />

      {/* Service promises */}
      <section className="usp" aria-label="Our promises">
        <ul role="list" className="container usp__list">
          <li>
            <TruckIcon size={22} />
            <span>Complimentary shipping over $150</span>
          </li>
          <li>
            <ReturnIcon size={22} />
            <span>30-day returns, no questions</span>
          </li>
          <li>
            <LeafIcon size={22} />
            <span>Natural &amp; certified fibres</span>
          </li>
        </ul>
      </section>

      {/* New arrivals */}
      <section className="section container" aria-labelledby="new-title">
        <div className="section-head">
          <div>
            <p className="eyebrow">Just landed</p>
            <h2 id="new-title" className="h2">
              New Arrivals
            </h2>
          </div>
          <Link to="/shop?sort=newest&filter=new" className="link-underline">
            View all
          </Link>
        </div>
        <ProductRail products={arrivals} label="New arrivals" />
      </section>

      {/* Featured collection */}
      <section className="feature" aria-labelledby="feature-title">
        <div className="feature__media media">
          <img
            src="/images/editorial/collection-autumn-800.webp"
            srcSet="/images/editorial/collection-autumn-800.webp 800w, /images/editorial/collection-autumn-1300.webp 1300w"
            sizes="(min-width: 1024px) 50vw, 100vw"
            width="1300"
            height="1625"
            alt="Model in a wide-brimmed felt hat and ivory blouse against a dark backdrop"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="feature__content">
          <p className="eyebrow">Featured collection · FW26</p>
          <h2 id="feature-title" className="h1">
            Autumn <em className="serif-italic">Atelier</em>
          </h2>
          <p className="lead">
            Warm neutrals, brushed wools and long, easy silhouettes. A collection built around texture — made for layering
            as the light changes.
          </p>
          <div className="feature__products">
            {autumn.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Link to="/shop?collection=autumn-atelier" className="btn btn--outline feature__cta">
            Explore the collection
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="section container" aria-labelledby="cat-title">
        <div className="section-head">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2 id="cat-title" className="h2">
              The Wardrobe
            </h2>
          </div>
          <Link to="/shop" className="link-underline">
            Shop all
          </Link>
        </div>
        <ul role="list" className="cats">
          {homeCats.map((c) => (
            <li key={c.slug}>
              <Link to={`/shop?category=${c.slug}`} className="cat-card">
                <span className="cat-card__media media">
                  <img src={c.image} alt="" width="700" height="875" loading="lazy" decoding="async" />
                </span>
                <span className="cat-card__label">
                  <span className="cat-card__name">{c.name}</span>
                  <span className="cat-card__count">
                    {countFor(c.slug)} pieces <ArrowRight size={14} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Editorial campaign */}
      <section className="campaign on-dark" aria-labelledby="campaign-title">
        <div className="container campaign__grid">
          <div className="campaign__main media">
            <img
              src="/images/editorial/campaign-main-800.webp"
              srcSet="/images/editorial/campaign-main-800.webp 800w, /images/editorial/campaign-main-1300.webp 1300w"
              sizes="(min-width: 1024px) 45vw, 100vw"
              width="1300"
              height="1625"
              alt="Woman walking through the city in a navy double-breasted trouser suit"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="campaign__text">
            <p className="eyebrow campaign__eyebrow">The Campaign — Studio Tailoring</p>
            <h2 id="campaign-title" className="h1">
              Soft shoulders,
              <br />
              <em className="serif-italic">sharp intent.</em>
            </h2>
            <p className="campaign__copy">
              Suiting cut for movement rather than ceremony. Unpadded blazers, fluid trousers and double-breasted
              jackets — designed to be worn with trainers on Monday and heels on Friday.
            </p>
            <figure className="campaign__secondary media">
              <img
                src="/images/editorial/campaign-secondary-700.webp"
                width="700"
                height="875"
                alt="Man in a brown tweed blazer, scarf and leather bag strap, close crop"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <Link to="/shop?collection=studio-tailoring" className="btn btn--ghost-light">
              Explore tailoring
            </Link>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="section container" aria-labelledby="best-title">
        <div className="section-head">
          <div>
            <p className="eyebrow">Most loved</p>
            <h2 id="best-title" className="h2">
              Best Sellers
            </h2>
          </div>
          <Link to="/shop?filter=bestsellers" className="link-underline">
            View all
          </Link>
        </div>
        <ProductGrid products={best} columns={4} />
      </section>

      {/* Promo banner */}
      <section className="promo" aria-labelledby="promo-title">
        <picture>
          <source media="(max-width: 767px)" srcSet="/images/editorial/promo-banner-mobile-800.webp" />
          <img
            src="/images/editorial/promo-banner-1800.webp"
            srcSet="/images/editorial/promo-banner-900.webp 900w, /images/editorial/promo-banner-1800.webp 1800w"
            sizes="100vw"
            width="1800"
            height="788"
            alt="Rail of neutral knitwear and coats beside dried pampas grass"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="promo__content container on-dark">
          <p className="eyebrow promo__eyebrow">The Winter Edit</p>
          <h2 id="promo-title" className="h1">
            Up to 20% off <em className="serif-italic">selected pieces</em>
          </h2>
          <Link to="/shop?filter=sale" className="btn btn--light">
            Shop the edit
          </Link>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
