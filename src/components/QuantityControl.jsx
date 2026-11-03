import { useState } from 'react';
import styles from './QuantityControl.module.css';

export default function QuantityControl({ value, onChange, min = 1, max = 99, label = 'Количество' }) {
  // Черновик ввода: пока поле в фокусе, можно стереть число и набрать новое
  const [draft, setDraft] = useState(null);
  const set = (next) => onChange(Math.min(max, Math.max(min, Math.floor(next) || min)));

  const handleInput = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, String(max).length);
    setDraft(digits);
    if (digits) set(Number(digits));
  };

  return (
    <div className={styles.control} role="group" aria-label={label}>
      <button type="button" className={styles.btn} onClick={() => set(value - 1)} disabled={value <= min} aria-label="Уменьшить">
        −
      </button>
      <input
        type="text"
        className={styles.input}
        value={draft ?? value}
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        onChange={handleInput}
        onBlur={() => setDraft(null)}
      />
      <button type="button" className={styles.btn} onClick={() => set(value + 1)} disabled={value >= max} aria-label="Увеличить">
        +
      </button>
    </div>
  );
}
