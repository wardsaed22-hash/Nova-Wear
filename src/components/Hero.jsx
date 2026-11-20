import { Link } from 'react-router-dom';
import { ArrowRight } from './Icons';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media media">
        <img
          src="/images/hero/hero-main-800.webp"
          srcSet="/images/hero/hero-main-800.webp 800w, /images/hero/hero-main-1400.webp 1400w"
          sizes="(min-width: 1024px) 58vw, 100vw"
          width="1400"
          height="1750"
          alt="Model in a long cream wool overcoat standing in warm afternoon light"
          fetchpriority="high"
          decoding="async"
        />
        <Link to="/product/cream-wool-overcoat" className="hero__tag">
          <span className="hero__tag-label">Shown</span>
          <span>Cream Wool Overcoat — $320</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="hero__content">
        <p className="eyebrow hero__eyebrow">Autumn / Winter 2026</p>
        <h1 id="hero-title" className="display hero__title">
          Modern Essentials. <em>Elevated.</em>
        </h1>
        <p className="lead hero__lead">
          Brushed wools, fine merino and softly structured tailoring — a quieter kind of luxury, designed to be worn for
          years.
        </p>
        <div className="hero__ctas">
          <Link to="/shop?collection=autumn-atelier" className="btn btn--primary hero__btn-main">
            Shop Collection
          </Link>
          <Link to="/shop?sort=newest&filter=new" className="btn btn--outline hero__btn-alt">
            New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
