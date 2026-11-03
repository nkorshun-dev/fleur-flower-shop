import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import styles from './OrderSummary.module.css';

// Блок с расчётом суммы — общий для корзины и оформления заказа
export default function OrderSummary({ children }) {
  const { subtotal, discount, delivery, total, promo } = useCart();

  return (
    <div className={styles.summary}>
      <dl className={styles.rows}>
        <div>
          <dt>Товары</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className={styles.discount}>
            <dt>Скидка по {promo}</dt>
            <dd>−{formatPrice(discount)}</dd>
          </div>
        )}
        <div>
          <dt>Доставка</dt>
          <dd>{delivery === 0 ? 'Бесплатно' : formatPrice(delivery)}</dd>
        </div>
        <div className={styles.total}>
          <dt>Итого</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  );
}
