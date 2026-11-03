import { createContext, useContext, useMemo, useReducer } from 'react';
import { products } from '../data/products';
import { readStorage, useLocalStorage, useStorageSync } from '../hooks/useLocalStorage';

const STORAGE_KEY = 'fleur-cart';
export const PROMO_CODE = 'FLEUR10';
export const PROMO_DISCOUNT = 0.1;
export const FREE_DELIVERY_FROM = 150;
export const DELIVERY_PRICE = 9;
const MAX_QTY = 99;

const CartContext = createContext(null);

const clampQty = (qty) => Math.min(MAX_QTY, Math.max(1, Math.round(qty) || 1));
// Регистр и пробелы в промокоде не важны: « fleur 10 » === FLEUR10
const normalizePromo = (code) => String(code ?? '').replace(/\s+/g, '').toUpperCase();
// Все суммы считаем в целых копейках, чтобы не было ошибок округления вида 116.10000000000001
const toCents = (byn) => Math.round(byn * 100);

// Приводим сохранённые данные к текущему формату. Битые записи отбрасываем,
// старый формат (просто массив строк) и повторы одного товара тоже понимаем.
function sanitize(saved) {
  const raw = Array.isArray(saved) ? saved : Array.isArray(saved?.items) ? saved.items : [];
  const items = [];
  for (const entry of raw) {
    const id = Number(entry?.id);
    if (!products.some((p) => p.id === id)) continue;
    const existing = items.find((i) => i.id === id);
    if (existing) existing.qty = clampQty(existing.qty + Number(entry.qty));
    else items.push({ id, qty: clampQty(Number(entry.qty)) });
  }
  return { items, promo: normalizePromo(saved?.promo) === PROMO_CODE ? PROMO_CODE : null };
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((i) => i.id === action.id);
      const items = existing
        ? state.items.map((i) => (i.id === action.id ? { ...i, qty: clampQty(i.qty + action.qty) } : i))
        : [...state.items, { id: action.id, qty: clampQty(action.qty) }];
      return { ...state, items };
    }
    case 'setQty':
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, qty: clampQty(action.qty) } : i)),
      };
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'restore': {
      // Товар уже вернули или добавили заново — не создаём вторую строку
      if (state.items.some((i) => i.id === action.item.id)) return state;
      const items = [...state.items];
      items.splice(Math.min(action.index, items.length), 0, action.item);
      return { ...state, items };
    }
    case 'applyPromo':
      return { ...state, promo: PROMO_CODE };
    case 'removePromo':
      return { ...state, promo: null };
    case 'clear':
      return { items: [], promo: null };
    case 'replace':
      return sanitize(action.saved);
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => sanitize(readStorage(STORAGE_KEY, {})));
  useLocalStorage(STORAGE_KEY, state);
  useStorageSync(STORAGE_KEY, {}, (saved) => dispatch({ type: 'replace', saved }));

  const value = useMemo(() => {
    const lines = state.items.map((item) => ({ ...item, product: products.find((p) => p.id === item.id) }));
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.qty * toCents(l.product.price), 0);
    const discount = state.promo ? Math.round(subtotal * PROMO_DISCOUNT) : 0;
    const delivery = subtotal === 0 || subtotal >= toCents(FREE_DELIVERY_FROM) ? 0 : toCents(DELIVERY_PRICE);

    return {
      lines,
      count,
      subtotal: subtotal / 100,
      discount: discount / 100,
      delivery: delivery / 100,
      total: (subtotal - discount + delivery) / 100,
      promo: state.promo,
      add: (id, qty = 1) => dispatch({ type: 'add', id, qty }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      // Возвращает функцию «Отменить», которая вернёт товар на то же место с тем же количеством
      remove: (id) => {
        const index = state.items.findIndex((i) => i.id === id);
        if (index === -1) return () => {};
        const item = state.items[index];
        dispatch({ type: 'remove', id });
        return () => dispatch({ type: 'restore', index, item });
      },
      applyPromo: (code) => {
        const ok = normalizePromo(code) === PROMO_CODE;
        if (ok) dispatch({ type: 'applyPromo' });
        return ok;
      },
      removePromo: () => dispatch({ type: 'removePromo' }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
