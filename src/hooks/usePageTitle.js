import { useEffect } from 'react';

const SITE = 'Флёр';
export const DEFAULT_TITLE = 'Флёр — доставка цветов по Минску за 2 часа';

// Заголовок вкладки для текущей страницы
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : DEFAULT_TITLE;
  }, [title]);
}
