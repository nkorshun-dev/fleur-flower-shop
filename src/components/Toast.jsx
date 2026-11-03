import { CloseIcon } from './Icons';
import styles from './Toast.module.css';

export default function Toast({ toasts, onDismiss }) {
  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={styles.toast}>
          <span className={styles.message}>{t.message}</span>
          {t.actionLabel && (
            <button
              type="button"
              className={styles.action}
              onClick={() => {
                t.onAction();
                onDismiss(t.id);
              }}
            >
              {t.actionLabel}
            </button>
          )}
          <button type="button" className={styles.close} onClick={() => onDismiss(t.id)} aria-label="Закрыть уведомление">
            <CloseIcon width={18} height={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
