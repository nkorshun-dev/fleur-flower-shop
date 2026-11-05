import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Filters from '../components/Filters';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import SortSelect, { SORT_OPTIONS } from '../components/SortSelect';
import { CloseIcon, FilterIcon } from '../components/Icons';
import { CATEGORIES, SIZES } from '../data/products';
import { useDebounce } from '../hooks/useDebounce';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProducts } from '../hooks/useProducts';
import styles from './Catalog.module.css';

const PAGE_SIZE = 12;
const DESKTOP_QUERY = '(min-width: 960px)';

const SORTERS = {
  popular: (a, b) => b.popularity - a.popularity,
  cheap: (a, b) => a.price - b.price,
  expensive: (a, b) => b.price - a.price,
  new: (a, b) => b.createdAt.localeCompare(a.createdAt),
};

// Поиск без учёта регистра и разницы «е/ё»
const normalize = (text) => text.toLowerCase().replace(/ё/g, 'е');

// Цена в адресе — только целое неотрицательное число, остальное отбрасываем
const parsePrice = (value) => (/^\d{1,6}$/.test(value ?? '') ? String(Number(value)) : '');

// Читаем фильтры из адреса страницы, отбрасывая неизвестные значения
function readFilters(params) {
  const category = params.get('category') ?? '';
  const sort = params.get('sort') ?? 'popular';
  return {
    q: params.get('q') ?? '',
    category: CATEGORIES.some((c) => c.id === category) ? category : '',
    priceMin: parsePrice(params.get('min')),
    priceMax: parsePrice(params.get('max')),
    sizes: (params.get('size') ?? '').split(',').filter((s, i, all) => SIZES.includes(s) && all.indexOf(s) === i),
    inStock: params.get('stock') === '1',
    sale: params.get('sale') === '1',
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : 'popular',
  };
}

function writeFilters(f) {
  const params = new URLSearchParams();
  if (f.q.trim()) params.set('q', f.q.trim());
  if (f.category) params.set('category', f.category);
  if (f.priceMin !== '') params.set('min', f.priceMin);
  if (f.priceMax !== '') params.set('max', f.priceMax);
  if (f.sizes.length) params.set('size', f.sizes.join(','));
  if (f.inStock) params.set('stock', '1');
  if (f.sale) params.set('sale', '1');
  if (f.sort !== 'popular') params.set('sort', f.sort);
  return params;
}

function applyFilters(products, f) {
  const q = normalize(f.q.trim());
  let min = f.priceMin === '' ? -Infinity : Number(f.priceMin);
  let max = f.priceMax === '' ? Infinity : Number(f.priceMax);
  // Если «от» больше «до» (например, пока пользователь ещё печатает) — считаем диапазон перевёрнутым
  if (min > max) [min, max] = [max, min];

  return products
    .filter((p) => {
      if (f.category && p.category !== f.category) return false;
      if (p.price < min || p.price > max) return false;
      if (f.sizes.length && !f.sizes.includes(p.size)) return false;
      if (f.inStock && !p.inStock) return false;
      if (f.sale && !p.oldPrice) return false;
      if (q && !normalize(`${p.name} ${p.composition.join(' ')}`).includes(q)) return false;
      return true;
    })
    // id как второй ключ — порядок одинаковых по цене товаров не «прыгает»
    .sort((a, b) => SORTERS[f.sort](a, b) || a.id - b.id);
}

const countActive = (f) =>
  [f.category, f.priceMin, f.priceMax, f.inStock, f.sale].filter(Boolean).length + f.sizes.length;

export default function Catalog() {
  const { products, loading, error, retry } = useProducts();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);

  const [searchText, setSearchText] = useState(filters.q);
  const debouncedSearch = useDebounce(searchText, 300);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  // Клик по фильтру — отдельная запись в истории (работают «Назад/Вперёд»),
  // ввод текста (поиск, цена) — замена текущей записи, чтобы не засорять историю
  const update = (patch, { replace = false } = {}) =>
    setParams(writeFilters({ ...filters, ...patch }), { replace });

  usePageTitle(CATEGORIES.find((c) => c.id === filters.category)?.name ?? 'Каталог');

  // Поиск из шапки или «Назад» меняет q в адресе — подхватываем его в поле ввода.
  // Если текст совпадает с точностью до пробелов по краям, не трогаем поле, иначе съедим пробел при наборе.
  useEffect(() => {
    setSearchText((text) => (text.trim() === filters.q.trim() ? text : filters.q));
  }, [filters.q]);

  useEffect(() => {
    if (debouncedSearch.trim() !== filters.q.trim()) update({ q: debouncedSearch }, { replace: true });
    // update пересоздаётся на каждом рендере, следим только за введённым текстом
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [params]);

  // Мобильная панель: Esc, блокировка прокрутки, фокус внутрь и обратно на кнопку
  useEffect(() => {
    if (!panelOpen) return undefined;
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const close = () => setPanelOpen(false);
    const panel = panelRef.current;
    const onKey = (e) => {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab') return;
      // Фокус ходит по кругу внутри панели
      const items = [...panel.querySelectorAll('button, input, select, a[href]')].filter((el) => !el.disabled && el.offsetParent !== null);
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!panel.contains(active) || (e.shiftKey && (active === first || active === panel))) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // Фон недоступен: inert на всех соседях панели вплоть до корня
    const inerted = [];
    for (let node = panel; node && node !== document.body; node = node.parentElement) {
      for (const sib of node.parentElement?.children ?? []) {
        if (sib !== node && !sib.inert) {
          sib.inert = true;
          inerted.push(sib);
        }
      }
    }
    const onResize = (e) => e.matches && close();
    const toggle = toggleRef.current;

    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onResize);
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onResize);
      document.body.style.overflow = '';
      inerted.forEach((el) => {
        el.inert = false;
      });
      if (!desktop.matches) toggle?.focus();
    };
  }, [panelOpen]);

  const found = useMemo(() => applyFilters(products, filters), [products, filters]);
  const activeCount = countActive(filters);
  const hasAnyFilter = activeCount > 0 || filters.q !== '';
  const categoryName = CATEGORIES.find((c) => c.id === filters.category)?.name;

  const reset = () => {
    setSearchText('');
    setParams(filters.sort === 'popular' ? {} : { sort: filters.sort });
  };

  // Когда пользователь закончил ввод цены: если «от» больше «до», меняем их местами
  const normalizePrice = () => {
    const { priceMin, priceMax } = filters;
    if (priceMin !== '' && priceMax !== '' && Number(priceMin) > Number(priceMax)) {
      update({ priceMin: priceMax, priceMax: priceMin }, { replace: true });
    }
  };

  return (
    <div className="container page">
      <h1 className="page-title">{categoryName ?? 'Каталог'}</h1>

      <div className={styles.layout}>
        <aside
          id="filters-panel"
          ref={panelRef}
          tabIndex={-1}
          className={`${styles.panel} ${panelOpen ? styles.panelOpen : ''}`}
          {...(panelOpen ? { role: 'dialog', 'aria-modal': 'true' } : {})}
          aria-labelledby="filters-title"
        >
          <div className={styles.panelHead}>
            <h2 id="filters-title" className={styles.panelTitle}>Фильтры</h2>
            <button
              type="button"
              className={styles.panelClose}
              onClick={() => setPanelOpen(false)}
              aria-label="Закрыть фильтры"
            >
              <CloseIcon />
            </button>
          </div>
          <Filters filters={filters} onChange={update} onPriceBlur={normalizePrice} />
          <div className={styles.panelFooter}>
            {hasAnyFilter && (
              <button type="button" className="btn btn-outline" onClick={reset}>
                Сбросить фильтры
              </button>
            )}
            <button type="button" className={`btn btn-primary ${styles.panelApply}`} onClick={() => setPanelOpen(false)}>
              Показать {found.length}
            </button>
          </div>
        </aside>
        {panelOpen && <div className={styles.backdrop} onClick={() => setPanelOpen(false)} aria-hidden="true" />}

        <section className={styles.results} aria-label="Товары">
          <div className={styles.toolbar}>
            <div className={styles.search}>
              <SearchBar value={searchText} onChange={setSearchText} />
            </div>
            <button
              ref={toggleRef}
              type="button"
              className={`btn btn-outline ${styles.filterToggle}`}
              onClick={() => setPanelOpen(true)}
              aria-expanded={panelOpen}
              aria-controls="filters-panel"
            >
              <FilterIcon width={18} height={18} />
              Фильтры{activeCount > 0 && ` (${activeCount})`}
            </button>
            <SortSelect value={filters.sort} onChange={(sort) => update({ sort })} />
          </div>

          <div className={styles.summary}>
            <p className={styles.count} aria-live="polite">
              {loading ? 'Загружаем товары…' : error ? '' : `Найдено: ${found.length} ${plural(found.length)}`}
            </p>
            {hasAnyFilter && !loading && (
              <button type="button" className="btn btn-ghost" onClick={reset}>
                Сбросить фильтры
              </button>
            )}
          </div>

          {error ? (
            <EmptyState icon="!" title="Не удалось загрузить каталог" text="Проверьте подключение к интернету и попробуйте ещё раз.">
              <button type="button" className="btn btn-primary" onClick={retry}>
                Повторить
              </button>
            </EmptyState>
          ) : !loading && found.length === 0 ? (
            <EmptyState title="Ничего не найдено" text="Попробуйте изменить запрос или убрать часть фильтров.">
              <button type="button" className="btn btn-primary" onClick={reset}>
                Сбросить фильтры
              </button>
            </EmptyState>
          ) : (
            <>
              <ProductGrid products={found.slice(0, visible)} loading={loading} skeletonCount={6} />
              {!loading && visible < found.length && (
                <div className={styles.more}>
                  <button type="button" className="btn btn-outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Показать ещё
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function plural(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'товар';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'товара';
  return 'товаров';
}
