import { useStore } from '../context/StoreContext';
import { CheckIcon, CloseIcon } from './Icons';
import './Toast.css';

export default function Toast() {
  const { toasts, dismissToast } = useStore();

  return (
    <div className="toasts" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.image ? (
            <img className="toast__img" src={t.image} alt="" width="48" height="60" />
          ) : (
            <span className="toast__icon">
              <CheckIcon size={18} />
            </span>
          )}
          <div className="toast__body">
            <p className="toast__title">{t.title}</p>
            {t.message && <p className="toast__msg">{t.message}</p>}
          </div>
          {t.action && (
            <button
              type="button"
              className="toast__action"
              onClick={() => {
                t.action.onClick();
                dismissToast(t.id);
              }}
            >
              {t.action.label}
            </button>
          )}
          <button type="button" className="toast__close" aria-label="Dismiss notification" onClick={() => dismissToast(t.id)}>
            <CloseIcon size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
