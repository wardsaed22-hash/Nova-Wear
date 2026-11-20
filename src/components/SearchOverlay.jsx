import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useModal } from '../hooks/useModal';
import { categories, collections, getCategory, searchProducts } from '../data/products';
import Price from './Price';
import { ArrowRight, CloseIcon, SearchIcon } from './Icons';
import './SearchOverlay.css';

const POPULAR = ['Coat', 'Merino', 'Blazer', 'Denim', 'Autumn Atelier', 'Accessories'];
const MAX_RESULTS = 8;

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const close = () => setSearchOpen(false);
  const inputRef = useRef(null);
  const ref = useModal(searchOpen, close, { initialFocus: inputRef });

  if (!searchOpen) return null;
  return <SearchPanel panelRef={ref} inputRef={inputRef} close={close} />;
}

function SearchPanel({ panelRef, inputRef, close }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const q = query.trim();

  const results = useMemo(() => searchProducts(q), [q]);
  const matchingGroups = useMemo(() => {
    if (!q) return [];
    const lower = q.toLowerCase();
    return [
      ...categories.filter((c) => c.name.toLowerCase().includes(lower)).map((c) => ({ ...c, to: `/shop?category=${c.slug}` })),
      ...collections.filter((c) => c.name.toLowerCase().includes(lower)).map((c) => ({ ...c, to: `/shop?collection=${c.slug}` })),
    ];
  }, [q]);

  const submit = (e) => {
    e.preventDefault();
    if (q) navigate(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <div className="overlay" onClick={close} aria-hidden="true" />
      <div ref={panelRef} className="search" role="dialog" aria-modal="true" aria-label="Search the store" tabIndex={-1}>
        <div className="container search__inner">
          <form className="search__form" role="search" onSubmit={submit}>
            <label htmlFor="site-search" className="visually-hidden">
              Search products, categories and collections
            </label>
            <SearchIcon size={24} />
            <input
              ref={inputRef}
              id="site-search"
              className="search__input"
              type="search"
              placeholder="Search coats, knitwear, collections…"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-controls="search-results"
            />
            <button type="button" className="icon-btn" onClick={close} aria-label="Close search">
              <CloseIcon />
            </button>
          </form>

          <div id="search-results" className="search__body">
            {!q && (
              <div className="search__suggest">
                <p className="eyebrow">Popular searches</p>
                <ul role="list" className="search__chips">
                  {POPULAR.map((term) => (
                    <li key={term}>
                      <button type="button" className="chip" onClick={() => setQuery(term)}>
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {q && (
              <p className="search__count" aria-live="polite">
                {results.length === 0
                  ? `No results for “${q}”`
                  : `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${q}”`}
              </p>
            )}

            {matchingGroups.length > 0 && (
              <ul role="list" className="search__chips search__groups">
                {matchingGroups.map((g) => (
                  <li key={g.slug}>
                    <Link to={g.to} className="chip chip--link">
                      {g.name} <ArrowRight size={14} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {q && results.length === 0 && (
              <div className="search__empty">
                <p>Check the spelling or try a broader term — for example a category or fabric.</p>
                <ul role="list" className="search__chips">
                  {POPULAR.slice(0, 4).map((term) => (
                    <li key={term}>
                      <button type="button" className="chip" onClick={() => setQuery(term)}>
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.length > 0 && (
              <>
                <ul role="list" className="search__results">
                  {results.slice(0, MAX_RESULTS).map((p) => (
                    <li key={p.id}>
                      <Link to={`/product/${p.slug}`} className="search-item">
                        <span className="search-item__media media">
                          <img src={p.images[0].sm} alt="" width="600" height="750" loading="lazy" />
                        </span>
                        <span className="search-item__info">
                          <span className="search-item__cat">{getCategory(p.category)?.name}</span>
                          <span className="search-item__name">{p.name}</span>
                          <Price price={p.price} originalPrice={p.originalPrice} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to={`/shop?q=${encodeURIComponent(q)}`} className="link-underline search__all">
                  View all {results.length} results <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
