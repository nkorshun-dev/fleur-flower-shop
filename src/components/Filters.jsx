import { CATEGORIES, SIZES } from '../data/products';
import styles from './Filters.module.css';

export const PRICE_MIN = 39;
export const PRICE_MAX = 420;

// В поле цены пропускаем только цифры, ведущие нули убираем
const cleanPrice = (value) => value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 6);

export default function Filters({ filters, onChange, onPriceBlur }) {
  const toggleSize = (size) => {
    const sizes = filters.sizes.includes(size) ? filters.sizes.filter((s) => s !== size) : [...filters.sizes, size];
    onChange({ sizes });
  };

  const priceProps = (field, placeholder, label) => ({
    type: 'text',
    className: 'input',
    inputMode: 'numeric',
    autoComplete: 'off',
    placeholder: String(placeholder),
    'aria-label': label,
    value: filters[field],
    onChange: (e) => onChange({ [field]: cleanPrice(e.target.value) }, { replace: true }),
    onBlur: onPriceBlur,
  });

  return (
    <div className={styles.filters}>
      <fieldset className={styles.group}>
        <legend className={styles.legend}>Категория</legend>
        {[{ id: '', name: 'Все товары' }, ...CATEGORIES].map((c) => (
          <label key={c.id || 'all'} className={styles.option}>
            <input
              type="radio"
              name="category"
              checked={filters.category === c.id}
              onChange={() => onChange({ category: c.id })}
            />
            {c.name}
          </label>
        ))}
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Цена, BYN</legend>
        <div className={styles.price}>
          <label className={styles.priceField}>
            <span aria-hidden="true">от</span>
            <input {...priceProps('priceMin', PRICE_MIN, 'Цена от')} />
          </label>
          <label className={styles.priceField}>
            <span aria-hidden="true">до</span>
            <input {...priceProps('priceMax', PRICE_MAX, 'Цена до')} />
          </label>
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Размер</legend>
        <div className={styles.sizes}>
          {SIZES.map((size) => (
            <label key={size} className={styles.size}>
              <input type="checkbox" checked={filters.sizes.includes(size)} onChange={() => toggleSize(size)} />
              <span>{size}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className="visually-hidden">Дополнительно</legend>
        <label className={styles.option}>
          <input type="checkbox" checked={filters.inStock} onChange={(e) => onChange({ inStock: e.target.checked })} />
          Только в наличии
        </label>
        <label className={styles.option}>
          <input type="checkbox" checked={filters.sale} onChange={(e) => onChange({ sale: e.target.checked })} />
          Только со скидкой
        </label>
      </fieldset>
    </div>
  );
}
