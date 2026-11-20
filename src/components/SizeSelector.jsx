import { RulerIcon } from './Icons';

export default function SizeSelector({ sizes, unavailable = [], value, onChange, onOpenGuide, error }) {
  const oneSize = sizes.length === 1;
  return (
    <div className="selector">
      <div className="selector__head">
        <p id="size-label" className="selector__legend">
          Size: <span>{value || (oneSize ? sizes[0] : 'Select a size')}</span>
        </p>
        {!oneSize && (
          <button type="button" className="selector__guide" onClick={onOpenGuide} aria-haspopup="dialog">
            <RulerIcon size={16} />
            Size guide
          </button>
        )}
      </div>
      <div
        className={`sizes ${error ? 'has-error' : ''}`}
        role="radiogroup"
        aria-labelledby="size-label"
        aria-describedby={error ? 'size-error' : undefined}
        aria-invalid={Boolean(error)}
      >
        {sizes.map((s) => {
          const disabled = unavailable.includes(s);
          return (
            <label key={s} className={`size-opt ${disabled ? 'is-disabled' : ''}`}>
              <input
                type="radio"
                name="size"
                value={s}
                checked={value === s}
                disabled={disabled}
                onChange={() => onChange(s)}
                className="visually-hidden"
                aria-label={disabled ? `${s}, sold out` : s}
              />
              <span aria-hidden="true">{s}</span>
            </label>
          );
        })}
      </div>
      {unavailable.length > 0 && !error && <p className="selector__note">Crossed-out sizes are sold out.</p>}
      {error && (
        <p id="size-error" className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
