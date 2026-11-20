import { useEffect, useRef, useState } from 'react';
import { useModal } from '../hooks/useModal';
import { srcSet } from '../utils/format';
import { ChevronLeft, ChevronRight, CloseIcon, ExpandIcon } from './Icons';
import './ProductGallery.css';

const VIEW_LABELS = ['Front view', 'Detail view', 'Close-up of fabric'];

/**
 * Desktop: vertical thumbnails + main image with hover zoom.
 * Mobile: swipeable scroll-snap carousel with indicators.
 * Both open a full-screen lightbox.
 */
export default function ProductGallery({ product }) {
  const { images, name } = product;
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null);
  const [lightbox, setLightbox] = useState(false);
  const trackRef = useRef(null);

  // Reset when navigating between products.
  useEffect(() => {
    setActive(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [product.id]);

  const altFor = (i) => `${name} — ${VIEW_LABELS[i] ?? `view ${i + 1}`}`;

  const goTo = (i) => {
    const idx = (i + images.length) % images.length;
    setActive(idx);
    const track = trackRef.current;
    if (track && track.offsetParent !== null) track.scrollTo({ left: idx * track.clientWidth, behavior: 'smooth' });
  };

  const onTrackScroll = () => {
    const track = trackRef.current;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    if (idx !== active) setActive(idx);
  };

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="gallery">
      {/* Desktop thumbnails */}
      <ul role="list" className="gallery__thumbs" aria-label="Product images">
        {images.map((img, i) => (
          <li key={img.sm}>
            <button
              type="button"
              className={`gallery__thumb media ${i === active ? 'is-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === active}
            >
              <img src={img.sm} alt="" width="600" height="750" loading="lazy" decoding="async" />
            </button>
          </li>
        ))}
      </ul>

      {/* Desktop main image with hover zoom */}
      <div className="gallery__stage">
        <button
          type="button"
          className={`gallery__main media ${zoom ? 'is-zooming' : ''}`}
          onMouseMove={onMove}
          onMouseLeave={() => setZoom(null)}
          onClick={() => setLightbox(true)}
          aria-label="Open full-screen gallery"
        >
          <img
            key={images[active].lg}
            src={images[active].lg}
            srcSet={srcSet(images[active])}
            sizes="(min-width: 1024px) 50vw, 100vw"
            width="1000"
            height="1250"
            alt={altFor(active)}
            style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            decoding="async"
          />
          <span className="gallery__hint" aria-hidden="true">
            <ExpandIcon size={16} /> Hover to zoom · Click to expand
          </span>
        </button>
        <div className="gallery__arrows">
          <button type="button" className="gallery__arrow" onClick={() => goTo(active - 1)} aria-label="Previous image">
            <ChevronLeft size={20} />
          </button>
          <button type="button" className="gallery__arrow" onClick={() => goTo(active + 1)} aria-label="Next image">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Mobile swipe carousel */}
      <div className="gallery__mobile">
        <ul role="list" ref={trackRef} className="gallery__track" onScroll={onTrackScroll} aria-label="Product images, swipe to browse">
          {images.map((img, i) => (
            <li key={img.lg} className="gallery__slide media">
              <button type="button" onClick={() => setLightbox(true)} aria-label={`Expand image ${i + 1} of ${images.length}`}>
                <img
                  src={img.sm}
                  srcSet={srcSet(img)}
                  sizes="100vw"
                  width="1000"
                  height="1250"
                  alt={altFor(i)}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </button>
            </li>
          ))}
        </ul>
        <div className="gallery__dots" aria-hidden="true">
          {images.map((img, i) => (
            <span key={img.sm} className={i === active ? 'is-active' : ''} />
          ))}
        </div>
        <span className="gallery__counter">
          {active + 1} / {images.length}
        </span>
      </div>

      {lightbox && (
        <Lightbox images={images} start={active} altFor={altFor} onClose={() => setLightbox(false)} onChange={goTo} />
      )}
    </div>
  );
}

function Lightbox({ images, start, altFor, onClose, onChange }) {
  const [index, setIndex] = useState(start);
  const ref = useModal(true, onClose);

  const go = (i) => {
    const idx = (i + images.length) % images.length;
    setIndex(idx);
    onChange(idx);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div ref={ref} className="lightbox" role="dialog" aria-modal="true" aria-label="Image gallery" tabIndex={-1}>
      <button type="button" className="icon-btn lightbox__close" onClick={onClose} aria-label="Close gallery">
        <CloseIcon />
      </button>
      <figure className="lightbox__figure">
        <img src={images[index].lg} alt={altFor(index)} width="1000" height="1250" />
        <figcaption className="lightbox__caption">
          {index + 1} / {images.length}
        </figcaption>
      </figure>
      <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => go(index - 1)} aria-label="Previous image">
        <ChevronLeft size={24} />
      </button>
      <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => go(index + 1)} aria-label="Next image">
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
