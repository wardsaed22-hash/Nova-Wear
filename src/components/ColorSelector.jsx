export default function ColorSelector({ colors, value, onChange }) {
  return (
    <fieldset className="selector">
      <legend className="selector__legend">
        Colour: <span>{value}</span>
      </legend>
      <div className="swatches">
        {colors.map((c) => (
          <label key={c.name} className="swatch" title={c.name}>
            <input
              type="radio"
              name="color"
              value={c.name}
              checked={value === c.name}
              onChange={() => onChange(c.name)}
              className="visually-hidden"
            />
            <span className="swatch__dot" style={{ background: c.hex }} aria-hidden="true" />
            <span className="visually-hidden">{c.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
