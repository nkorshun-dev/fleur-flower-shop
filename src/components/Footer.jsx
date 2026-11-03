import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/products';
import styles from './Footer.module.css';

const SOCIALS = [
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://t.me', label: 'Telegram' },
  { href: 'https://vk.com', label: 'ВКонтакте' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.logo}>Флёр</p>
          <p className={styles.muted}>
            Небольшая мастерская на Сурганова. Собираем букеты в день заказа и присылаем фото перед отправкой.
          </p>
        </div>

        <nav aria-label="Каталог">
          <h2 className={styles.title}>Каталог</h2>
          <ul className={styles.list}>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={`/catalog?category=${c.id}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={styles.title}>Контакты</h2>
          <address className={styles.list}>
            <span>г. Минск, ул. Сурганова, 43, пом. 12</span>
            <a href="tel:+375293184672">+375 (29) 318-46-72</a>
            <a href="mailto:hello@fleur.by">hello@fleur.by</a>
          </address>
        </div>

        <div>
          <h2 className={styles.title}>Часы работы</h2>
          <p className={styles.muted}>
            Ежедневно 8:00–22:00
            <br />
            Доставка 9:00–22:00
          </p>
          <ul className={styles.socials}>
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        © {new Date().getFullYear()} Флёр. Демо-проект для портфолио. Бизнес вымышленный, заказы не обрабатываются.
      </div>
    </footer>
  );
}
