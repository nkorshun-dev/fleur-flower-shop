import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProducts } from '../data/api';

export function useProducts() {
  const [state, setState] = useState({ products: [], loading: true, error: null });
  // Отмена предыдущего запроса: и при уходе со страницы, и при повторной попытке
  const cancelRef = useRef(() => {});

  const load = useCallback((isRetry = false) => {
    cancelRef.current();
    let cancelled = false;
    cancelRef.current = () => {
      cancelled = true;
    };
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchProducts({ isRetry })
      .then((products) => !cancelled && setState({ products, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ products: [], loading: false, error }));
  }, []);

  useEffect(() => {
    load();
    return () => cancelRef.current();
  }, [load]);

  const retry = useCallback(() => load(true), [load]);

  return { ...state, retry };
}
