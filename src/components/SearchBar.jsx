import { useId } from 'react';
import { SearchIcon } from './Icons';
import styles from './SearchBar.module.css';

// Управляемое поле поиска. onSubmit — необязательный, для шапки (переход в каталог).
export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Поиск по названию и составу' }) {
  const id = useId();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form className={styles.form} role="search" onSubmit={handleSubmit}>
      <label htmlFor={id} className="visually-hidden">
        Поиск цветов
      </label>
      <SearchIcon className={styles.icon} />
      <input
        id={id}
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
    </form>
  );
}
