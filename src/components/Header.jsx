import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import SearchBar from './SearchBar';
import { BagIcon, CloseIcon, HeartIcon, MenuIcon } from './Icons';
import styles from './Header.module.css';

const NAV = [
  { to: '/', label: 'Главная', end: true },
  { to: '/catalog', label: 'Каталог' },
  { to: '/catalog?category=bouquets', label: 'Букеты' },
  { to: '/catalog?category=plants', label: 'Растения' },
];

export default function Header() {
  const { count: cartCount } = useCart();
  const { count: favCount } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const search = (value) => {
    const q = value.trim();
    navigate(q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog');
    setQuery('');
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <button
          type="button"
          className={styles.burger}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link to="/" className={styles.logo} aria-label="Флёр — на главную">
          Флёр
        </Link>

        <nav id="main-nav" className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="Основное меню">
          <ul className={styles.navList}>
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive && !item.to.includes('?') ? styles.active : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className={styles.mobileSearch}>
            <SearchBar value={query} onChange={setQuery} onSubmit={search} placeholder="Найти букет" />
          </div>
        </nav>

        <div className={styles.search}>
          <SearchBar value={query} onChange={setQuery} onSubmit={search} placeholder="Найти букет" />
        </div>

        <div className={styles.actions}>
          <Link to="/favorites" className={styles.iconLink} aria-label={`Избранное, товаров: ${favCount}`}>
            <HeartIcon />
            {favCount > 0 && (
              <span key={favCount} className={styles.badge}>
                {favCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className={styles.iconLink} aria-label={`Корзина, товаров: ${cartCount}`}>
            <BagIcon />
            {cartCount > 0 && (
              <span key={cartCount} className={styles.badge}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      {menuOpen && <div className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-hidden="true" />}
    </header>
  );
}
