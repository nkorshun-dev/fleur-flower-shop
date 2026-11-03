import { useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import OrderSummary from '../components/OrderSummary';
import { FREE_DELIVERY_FROM, useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import styles from './Cart.module.css';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Cart() {
  usePageTitle('Корзина');
  const cart = useCart();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [promoError, setPromoError] = useState('');

  if (cart.lines.length === 0) {
    return (
      <div className="container page">
        <EmptyState title="Корзина пока пуста" titleAs="h1" text="Загляните в каталог — там много красивого.">
          <Link to="/catalog" className="btn btn-primary">
            Перейти в каталог
          </Link>
        </EmptyState>
      </div>
    );
  }

  const remove = (line) => {
    const undo = cart.remove(line.id);
    toast.show(`«${line.product.name}» удалён из корзины`, { actionLabel: 'Отменить', onAction: undo });
  };

  const applyPromo = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setPromoError('Введите промокод');
    } else if (cart.applyPromo(code)) {
      setPromoError('');
      setCode('');
      toast.show('Промокод применён: −10%');
    } else {
      setPromoError('Такого промокода нет. Проверьте написание');
    }
  };

  const left = Math.max(0, FREE_DELIVERY_FROM - cart.subtotal);
  const progress = Math.min(100, (cart.subtotal / FREE_DELIVERY_FROM) * 100);

  return (
    <div className="container page">
      <h1 className="page-title">Корзина</h1>
      <div className={styles.layout}>
        <ul className={styles.list}>
          {cart.lines.map((line) => (
            <CartItem
              key={line.id}
              line={line}
              onQtyChange={(qty) => cart.setQty(line.id, qty)}
              onRemove={() => remove(line)}
            />
          ))}
        </ul>

        <aside className={styles.aside} aria-label="Сумма заказа">
          <div className={styles.delivery}>
            <p>
              {left > 0 ? (
                <>
                  До бесплатной доставки осталось <strong>{formatPrice(left)}</strong>
                </>
              ) : (
                <strong>Доставка бесплатная 🎉</strong>
              )}
            </p>
            <div
              className={styles.progress}
              role="progressbar"
              aria-label="Прогресс до бесплатной доставки"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          {cart.promo ? (
            <div className={styles.promoApplied}>
              <span>
                Промокод <strong>{cart.promo}</strong> применён
              </span>
              <button type="button" className="btn btn-ghost" onClick={cart.removePromo}>
                Убрать
              </button>
            </div>
          ) : (
            <form className={styles.promo} onSubmit={applyPromo} noValidate>
              <label htmlFor="promo" className="visually-hidden">
                Промокод
              </label>
              <input
                id="promo"
                className="input"
                placeholder="Промокод"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setPromoError('');
                }}
                aria-invalid={Boolean(promoError)}
                aria-describedby={promoError ? 'promo-error' : undefined}
              />
              <button type="submit" className="btn btn-outline">
                Применить
              </button>
              {promoError && (
                <p id="promo-error" className={`field-error ${styles.promoError}`} role="alert">
                  {promoError}
                </p>
              )}
            </form>
          )}

          <OrderSummary>
            <Link to="/checkout" className="btn btn-primary">
              Оформить заказ
            </Link>
          </OrderSummary>
        </aside>
      </div>
    </div>
  );
}
