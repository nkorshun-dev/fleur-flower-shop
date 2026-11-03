import styles from './SortSelect.module.css';

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Популярные' },
  { value: 'cheap', label: 'Сначала дешевле' },
  { value: 'expensive', label: 'Сначала дороже' },
  { value: 'new', label: 'Новинки' },
];

export default function SortSelect({ value, onChange }) {
  return (
    <label className={styles.wrap}>
      <span className={styles.label}>Сортировка</span>
      <select className={`input ${styles.select}`} value={value} onChange={(e) => onChange(e.target.value)}>
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
