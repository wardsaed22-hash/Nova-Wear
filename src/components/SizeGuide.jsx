import { useModal } from '../hooks/useModal';
import { CloseIcon } from './Icons';

const APPAREL_ROWS = [
  ['XS', '4–6', '80–84', '62–66', '88–92'],
  ['S', '8–10', '85–89', '67–71', '93–97'],
  ['M', '12', '90–94', '72–76', '98–102'],
  ['L', '14', '95–100', '77–82', '103–108'],
  ['XL', '16', '101–106', '83–88', '109–114'],
];

const DENIM_ROWS = [
  ['26', '66', '90'],
  ['28', '71', '95'],
  ['30', '76', '100'],
  ['32', '81', '105'],
  ['34', '86', '110'],
];

export default function SizeGuide({ open, onClose, denim = false }) {
  const ref = useModal(open, onClose);
  if (!open) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />
      <div ref={ref} className="drawer drawer--right size-guide" role="dialog" aria-modal="true" aria-labelledby="size-guide-title" tabIndex={-1}>
        <div className="drawer__head">
          <h2 id="size-guide-title" className="drawer__title">
            Size guide
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close size guide">
            <CloseIcon />
          </button>
        </div>
        <div className="drawer__body size-guide__body">
          <p className="muted">
            Body measurements in centimetres. If you are between sizes, we recommend sizing up for outerwear and
            sizing down for knitwear.
          </p>

          {denim ? (
            <table className="size-table">
              <caption className="visually-hidden">Denim waist sizes</caption>
              <thead>
                <tr>
                  <th scope="col">Size (in)</th>
                  <th scope="col">Waist</th>
                  <th scope="col">Hip</th>
                </tr>
              </thead>
              <tbody>
                {DENIM_ROWS.map((r) => (
                  <tr key={r[0]}>
                    <th scope="row">{r[0]}</th>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="size-table">
              <caption className="visually-hidden">Apparel sizes</caption>
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">UK</th>
                  <th scope="col">Chest</th>
                  <th scope="col">Waist</th>
                  <th scope="col">Hip</th>
                </tr>
              </thead>
              <tbody>
                {APPAREL_ROWS.map((r) => (
                  <tr key={r[0]}>
                    <th scope="row">{r[0]}</th>
                    {r.slice(1).map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3 className="size-guide__h">How to measure</h3>
          <dl className="size-guide__dl">
            <dt>Chest</dt>
            <dd>Measure around the fullest part of your chest, keeping the tape horizontal.</dd>
            <dt>Waist</dt>
            <dd>Measure around the narrowest part of your natural waistline.</dd>
            <dt>Hip</dt>
            <dd>Stand with feet together and measure around the fullest part of your hips.</dd>
          </dl>
        </div>
      </div>
    </>
  );
}
