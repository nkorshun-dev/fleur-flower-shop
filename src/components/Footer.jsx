import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/products';
import styles from './Footer.module.css';

const SOCIALS = [
  { label: 'Instagram' },
  { label: 'Telegram' },
  { label: 'ВКонтакте' },
];

const DEMO = 'Демо-проект: ссылка не активна';

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
            <span className="demo-link" role="img" aria-label="Телефон +375 29 318-46-72 (в демо не активно)" title={DEMO}>
              +375 (29) 318-46-72
            </span>
            <span className="demo-link" role="img" aria-label="Почта hello@fleur.by (в демо не активно)" title={DEMO}>
              hello@fleur.by
            </span>
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
                <span className="demo-link" role="img" aria-label={`${s.label} (в демо не активно)`} title={DEMO}>
                  {s.label}
                </span>
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
