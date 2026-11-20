import { ALL_COLORS, PRICE_RANGES, categories } from '../data/products';
import { CheckIcon, ChevronDown } from './Icons';
import './Filters.css';

/**
 * Pure presentational filter panel. Selections live in the URL (see Shop page);
 * `counts` gives the number of matching products for each option.
 */
export default function Filters({ selected, counts, sizes, onToggle, onClear, activeCount }) {
  return (
    <div className="filters">
      <FilterGroup title="Category" count={selected.category.length}>
        <ul role="list" className="filters__list">
          {categories.map((c) => {
            const n = counts.category[c.slug] ?? 0;
            const checked = selected.category.includes(c.slug);
            return (
              <li key={c.slug}>
                <label className={`checkbox ${!n && !checked ? 'is-empty' : ''}`}>
                  <input type="checkbox" checked={checked} onChange={() => onToggle('category', c.slug)} />
                  <span className="filters__opt">{c.name}</span>
                  <span className="filters__n">{n}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Price" count={selected.price.length}>
        <ul role="list" className="filters__list">
          {PRICE_RANGES.map((r) => {
            const n = counts.price[r.id] ?? 0;
            const checked = selected.price.includes(r.id);
            return (
              <li key={r.id}>
                <label className={`checkbox ${!n && !checked ? 'is-empty' : ''}`}>
                  <input type="checkbox" checked={checked} onChange={() => onToggle('price', r.id)} />
                  <span className="filters__opt">{r.label}</span>
                  <span className="filters__n">{n}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Size" count={selected.size.length}>
        <div className="filters__sizes">
          {sizes.map((s) => {
            const active = selected.size.includes(s);
            const n = counts.size[s] ?? 0;
            if (!n && !active) return null;
            return (
              <button
                key={s}
                type="button"
                className={`size-chip ${active ? 'is-active' : ''}`}
                aria-pressed={active}
                onClick={() => onToggle('size', s)}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Colour" count={selected.color.length}>
        <ul role="list" className="filters__colors">
          {ALL_COLORS.map((c) => {
            const active = selected.color.includes(c.name);
            const n = counts.color[c.name] ?? 0;
            if (!n && !active) return null;
            return (
              <li key={c.name}>
                <button
                  type="button"
                  className={`color-opt ${active ? 'is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => onToggle('color', c.name)}
                >
                  <span className="color-opt__dot" style={{ background: c.hex }}>
                    {active && <CheckIcon size={12} />}
                  </span>
                  {c.name}
                </button>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      {activeCount > 0 && (
        <button type="button" className="filters__clear text-link" onClick={onClear}>
          Clear all filters ({activeCount})
        </button>
      )}
    </div>
  );
}

function FilterGroup({ title, count, children }) {
  return (
    <details className="filters__group" open>
      <summary className="filters__summary">
        <span>
          {title}
          {count > 0 && <span className="filters__badge">{count}</span>}
        </span>
        <ChevronDown size={18} />
      </summary>
      <div className="filters__content">{children}</div>
    </details>
  );
}
