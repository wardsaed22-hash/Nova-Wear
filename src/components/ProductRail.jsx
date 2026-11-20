import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from './Icons';
import './ProductRail.css';

/** Horizontally scrolling product row with scroll-snap; arrow buttons on pointer devices. */
export default function ProductRail({ products, label }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () =>
      setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const scroll = (dir) => {
    const el = ref.current;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="rail">
      <ul ref={ref} role="list" className="rail__track" aria-label={label}>
        {products.map((p) => (
          <li key={p.id} className="rail__item">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      <div className="rail__nav">
        <button type="button" className="rail__btn" onClick={() => scroll(-1)} disabled={edges.start} aria-label="Scroll left">
          <ChevronLeft size={20} />
        </button>
        <button type="button" className="rail__btn" onClick={() => scroll(1)} disabled={edges.end} aria-label="Scroll right">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
