import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import { CloseIcon, FilterIcon, SearchIcon } from '../components/Icons';
import { useModal } from '../hooks/useModal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import {
  ALL_SIZES,
  PRICE_RANGES,
  getCategory,
  getCollection,
  products,
  searchProducts,
} from '../data/products';
import './Shop.css';

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
];

const QUICK = [
  { id: '', label: 'All' },
  { id: 'new', label: 'New In' },
  { id: 'bestsellers', label: 'Best Sellers' },
  { id: 'sale', label: 'Sale' },
];

const FACETS = ['category', 'price', 'size', 'color'];
const list = (params, key) => (params.get(key) ? params.get(key).split(',').filter(Boolean) : []);

const facetTest = {
  category: (p, values) => values.includes(p.category),
  price: (p, values) =>
    values.some((id) => {
      const r = PRICE_RANGES.find((x) => x.id === id);
      return r && p.price >= r.min && p.price <= r.max;
    }),
  size: (p, values) => values.some((s) => p.sizes.includes(s) && !p.unavailableSizes.includes(s)),
  color: (p, values) => p.colors.some((c) => values.includes(c.name)),
};

const quickTest = {
  new: (p) => p.newArrival,
  bestsellers: (p) => p.bestSeller,
  sale: (p) => p.originalPrice > p.price,
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const q = params.get('q') ?? '';
  const collectionSlug = params.get('collection');
  const quick = params.get('filter') ?? '';
  const sort = params.get('sort') ?? 'featured';
  const selected = useMemo(
    () => Object.fromEntries(FACETS.map((f) => [f, list(params, f)])),
    [params],
  );

  /* Base set: search + collection + quick filter (everything except facets). */
  const base = useMemo(() => {
    let items = q.trim() ? searchProducts(q) : products;
    if (collectionSlug) items = items.filter((p) => p.collection === collectionSlug);
    if (quickTest[quick]) items = items.filter(quickTest[quick]);
    return items;
  }, [q, collectionSlug, quick]);

  const applyFacets = (items, except) =>
    items.filter((p) => FACETS.every((f) => f === except || !selected[f].length || facetTest[f](p, selected[f])));

  const results = useMemo(() => {
    const items = applyFacets(base);
    const sorted = [...items];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, selected, sort]);

  /* Facet counts: each facet is counted against all *other* active facets. */
  const counts = useMemo(() => {
    const c = { category: {}, price: {}, size: {}, color: {} };
    applyFacets(base, 'category').forEach((p) => (c.category[p.category] = (c.category[p.category] ?? 0) + 1));
    applyFacets(base, 'price').forEach((p) =>
      PRICE_RANGES.forEach((r) => {
        if (p.price >= r.min && p.price <= r.max) c.price[r.id] = (c.price[r.id] ?? 0) + 1;
      }),
    );
    applyFacets(base, 'size').forEach((p) =>
      p.sizes.forEach((s) => {
        if (!p.unavailableSizes.includes(s)) c.size[s] = (c.size[s] ?? 0) + 1;
      }),
    );
    applyFacets(base, 'color').forEach((p) => p.colors.forEach((col) => (c.color[col.name] = (c.color[col.name] ?? 0) + 1)));
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, selected]);

  const update = (mutate) => {
    const next = new URLSearchParams(params);
    mutate(next);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const toggle = (key, value) =>
    update((next) => {
      const current = list(next, key);
      const values = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      if (values.length) next.set(key, values.join(','));
      else next.delete(key);
    });

  const clearFacets = () => update((next) => FACETS.forEach((f) => next.delete(f)));
  const activeCount = FACETS.reduce((n, f) => n + selected[f].length, 0);

  /* Page heading */
  const singleCategory = selected.category.length === 1 ? getCategory(selected.category[0]) : null;
  const collection = collectionSlug ? getCollection(collectionSlug) : null;
  let title = 'Shop All';
  let intro = 'Considered essentials across outerwear, knitwear, tailoring and accessories.';
  if (q.trim()) {
    title = `“${q.trim()}”`;
    intro = 'Search results';
  } else if (collection) {
    title = collection.name;
    intro = collection.description;
  } else if (singleCategory) {
    title = singleCategory.name;
    intro = singleCategory.blurb;
  } else if (quick) {
    title = QUICK.find((x) => x.id === quick)?.label ?? title;
  }

  useDocumentMeta({
    title: q.trim() ? `Search: ${q.trim()}` : title,
    description: `${title} — ${intro}. Shop the NOVA WEAR demo store.`,
    path: '/shop',
  });

  const usedSizes = ALL_SIZES.filter((s) => products.some((p) => p.sizes.includes(s)));

  const activeChips = [
    ...selected.category.map((v) => ({ key: 'category', value: v, label: getCategory(v)?.name ?? v })),
    ...selected.price.map((v) => ({ key: 'price', value: v, label: PRICE_RANGES.find((r) => r.id === v)?.label ?? v })),
    ...selected.size.map((v) => ({ key: 'size', value: v, label: `Size ${v}` })),
    ...selected.color.map((v) => ({ key: 'color', value: v, label: v })),
  ];

  const filterPanel = (
    <Filters
      selected={selected}
      counts={counts}
      sizes={usedSizes}
      onToggle={toggle}
      onClear={clearFacets}
      activeCount={activeCount}
    />
  );

  return (
    <div className="shop">
      <header className="shop__head container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            {(collection || singleCategory) && !q && (
              <li>
                <span aria-current="page">{collection?.name ?? singleCategory.name}</span>
              </li>
            )}
          </ol>
        </nav>
        <div className="shop__title-row">
          <div>
            {collection && !q && <p className="eyebrow">Collection · {collection.season}</p>}
            {q.trim() && <p className="eyebrow">{intro}</p>}
            <h1 className="h1">{title}</h1>
            {!q.trim() && <p className="shop__intro">{intro}</p>}
          </div>
        </div>

        <div className="shop__quick" role="group" aria-label="Quick filters">
          {QUICK.map((x) => (
            <button
              key={x.id || 'all'}
              type="button"
              className={`chip ${quick === x.id ? 'is-active' : ''}`}
              aria-pressed={quick === x.id}
              onClick={() =>
                update((next) => {
                  if (x.id) next.set('filter', x.id);
                  else next.delete('filter');
                })
              }
            >
              {x.label}
            </button>
          ))}
        </div>
      </header>

      <div className="shop__toolbar-wrap">
        <div className="shop__toolbar container">
          <button type="button" className="shop__filter-btn" onClick={() => setDrawerOpen(true)} aria-haspopup="dialog">
            <FilterIcon size={20} />
            Filters
            {activeCount > 0 && <span className="filters__badge">{activeCount}</span>}
          </button>

          <form
            className="shop__search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label htmlFor="shop-search" className="visually-hidden">
              Search products
            </label>
            <SearchIcon size={18} />
            <input
              id="shop-search"
              type="search"
              placeholder="Search"
              autoComplete="off"
              value={q}
              onChange={(e) =>
                update((next) => {
                  if (e.target.value) next.set('q', e.target.value);
                  else next.delete('q');
                })
              }
            />
          </form>

          <p className="shop__count" aria-live="polite">
            {results.length} {results.length === 1 ? 'piece' : 'pieces'}
          </p>

          <div className="shop__sort">
            <label htmlFor="shop-sort" className="visually-hidden">
              Sort by
            </label>
            <select
              id="shop-sort"
              className="select shop__select"
              value={sort}
              onChange={(e) =>
                update((next) => {
                  if (e.target.value === 'featured') next.delete('sort');
                  else next.set('sort', e.target.value);
                })
              }
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id === 'featured' ? 'Sort: Featured' : s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="shop__body container">
        <aside className="shop__sidebar" aria-label="Product filters">
          {filterPanel}
        </aside>

        <section className="shop__results" aria-label="Products">
          {activeChips.length > 0 && (
            <ul role="list" className="shop__active">
              {activeChips.map((c) => (
                <li key={`${c.key}-${c.value}`}>
                  <button type="button" className="chip chip--active" onClick={() => toggle(c.key, c.value)}>
                    {c.label}
                    <CloseIcon size={14} />
                    <span className="visually-hidden">Remove filter</span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className="shop__clear text-link" onClick={clearFacets}>
                  Clear all
                </button>
              </li>
            </ul>
          )}

          {results.length > 0 ? (
            <ProductGrid products={results} columns={3} priorityCount={4} />
          ) : (
            <div className="empty-state">
              <span className="empty-state__icon">
                <SearchIcon />
              </span>
              <h2 className="h3">No pieces match</h2>
              <p>
                {q.trim()
                  ? `We couldn’t find anything for “${q.trim()}”. Try a category, fabric or colour instead.`
                  : 'Try removing a filter or two to see more of the collection.'}
              </p>
              <Link to="/shop" className="btn btn--primary">
                Reset and view all
              </Link>
            </div>
          )}
        </section>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        count={results.length}
        activeCount={activeCount}
        onClear={clearFacets}
      >
        {filterPanel}
      </FilterDrawer>
    </div>
  );
}

function FilterDrawer({ open, onClose, count, activeCount, onClear, children }) {
  const ref = useModal(open, onClose);
  if (!open) return null;
  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        className="drawer drawer--left filter-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
        tabIndex={-1}
      >
        <div className="drawer__head">
          <h2 id="filter-drawer-title" className="drawer__title">
            Filters
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close filters">
            <CloseIcon />
          </button>
        </div>
        <div className="drawer__body filter-drawer__body">{children}</div>
        <div className="drawer__foot filter-drawer__foot">
          <button type="button" className="btn btn--outline" onClick={onClear} disabled={!activeCount}>
            Clear
          </button>
          <button type="button" className="btn btn--primary" onClick={onClose}>
            Show {count} {count === 1 ? 'result' : 'results'}
          </button>
        </div>
      </div>
    </>
  );
}
