import { useEffect, useId, useRef } from 'react';
import { CloseIcon } from './Icons';
import styles from './Modal.module.css';

export default function Modal({ title, onClose, children }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onCloseRef.current();
      if (e.key !== 'Tab') return;
      // Держим фокус внутри окна
      const focusable = dialogRef.current.querySelectorAll('button, a[href], input, select, textarea');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      // Фокус на самом окне (сразу после открытия) или вне его — возвращаем внутрь
      if (!dialogRef.current.contains(document.activeElement) || document.activeElement === dialogRef.current) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previousFocus?.focus?.();
    };
  }, []);

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
          <CloseIcon />
        </button>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
