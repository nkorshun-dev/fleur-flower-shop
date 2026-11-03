import { createContext, useContext, useMemo, useReducer } from 'react';
import { products } from '../data/products';
import { readStorage, useLocalStorage, useStorageSync } from '../hooks/useLocalStorage';

const STORAGE_KEY = 'fleur-favorites';
const FavoritesContext = createContext(null);

// Оставляем только существующие товары без повторов; битые данные превращаются в пустой список
function sanitize(saved) {
  if (!Array.isArray(saved)) return [];
  const ids = saved.map(Number).filter((id) => products.some((p) => p.id === id));
  return [...new Set(ids)];
}

function reducer(ids, action) {
  if (action.type === 'replace') return sanitize(action.saved);
  if (action.type !== 'toggle') return ids;
  return ids.includes(action.id) ? ids.filter((id) => id !== action.id) : [...ids, action.id];
}

export function FavoritesProvider({ children }) {
  const [ids, dispatch] = useReducer(reducer, undefined, () => sanitize(readStorage(STORAGE_KEY, [])));
  useLocalStorage(STORAGE_KEY, ids);
  useStorageSync(STORAGE_KEY, [], (saved) => dispatch({ type: 'replace', saved }));

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      has: (id) => ids.includes(id),
      toggle: (id) => dispatch({ type: 'toggle', id }),
    }),
    [ids],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => useContext(FavoritesContext);
