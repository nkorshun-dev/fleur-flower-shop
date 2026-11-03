import { useEffect, useRef } from 'react';

const parse = (raw, fallback) => {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) ?? fallback;
  } catch {
    return fallback;
  }
};

export function readStorage(key, fallback) {
  try {
    return parse(window.localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
}

// Сохраняет значение в localStorage при каждом изменении
export function useLocalStorage(key, value) {
  useEffect(() => {
    try {
      const raw = JSON.stringify(value);
      // Не пишем то же самое: иначе вкладки начнут бесконечно пересылать друг другу событие storage
      if (window.localStorage.getItem(key) !== raw) window.localStorage.setItem(key, raw);
    } catch {
      // хранилище недоступно (приватный режим, переполнение) — работаем без него
    }
  }, [key, value]);
}

// Вызывает onChange, когда значение изменили в другой вкладке
export function useStorageSync(key, fallback, onChange) {
  const latest = useRef({ fallback, onChange });
  latest.current = { fallback, onChange };

  useEffect(() => {
    const onStorage = (e) => {
      if (e.storageArea !== window.localStorage || (e.key !== key && e.key !== null)) return;
      // e.key === null — в другой вкладке очистили всё хранилище
      const { fallback: empty, onChange: notify } = latest.current;
      notify(parse(e.key === null ? null : e.newValue, empty));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);
}
