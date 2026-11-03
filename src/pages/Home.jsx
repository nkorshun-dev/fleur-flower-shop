import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { CameraIcon, LeafIcon, StarIcon, TruckIcon } from '../components/Icons';
import { CATEGORIES, HERO_IMAGE } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import { imageSrcSet } from '../utils/imageSrcSet';
import styles from './Home.module.css';
import { usePageTitle } from '../hooks/usePageTitle';

const BENEFITS = [
  {
    icon: TruckIcon,
    title: 'Доставка по Минску',
    text: '9 BYN, от 150 BYN — бесплатно. Интервалы по 2 часа с 9:00 до 22:00. За город — по договорённости.',
  },
  {
    icon: CameraIcon,
    title: 'Фото букета перед отправкой',
    text: 'Пришлём снимок в Viber или Telegram. Если что-то не нравится, поправим до выезда курьера.',
  },
  {
    icon: LeafIcon,
    title: 'Открытка в подарок',
    text: 'Подпишем от руки вашим текстом. Можно отправить анонимно — получатель не узнает имя.',
  },
];

const OCCASIONS = [
  { title: 'День рождения', hint: 'Шляпные коробки: ваза не нужна', to: '/catalog?category=boxes&stock=1' },
  { title: 'Свидание', hint: 'Розы до 170 BYN', to: '/catalog?category=roses&max=170' },
  { title: 'Маме', hint: 'Букеты в наличии', to: '/catalog?category=bouquets&stock=1' },
  { title: 'Коллеге', hint: 'До 100 BYN, в наличии', to: '/catalog?max=100&stock=1' },
  { title: 'Извиниться', hint: 'Пионовидные розы', to: '/catalog?q=пионовидная' },
];

const REVIEWS = [
  {
    name: 'Алина К.',
    date: '28 октября 2026',
    rating: 5,
    text: 'Заказывала «Зефир» подруге на день рождения. За час до доставки прислали фото — я попросила убрать пампас, у неё аллергия. Убрали без вопросов.',
  },
  { name: 'Сергей', date: '21 октября 2026', rating: 5, text: 'Курьер приехал в свой интервал и позвонил за 15 минут. Всё.' },
  {
    name: 'Татьяна Михайловна',
    date: '12 октября 2026',
    rating: 5,
    text: 'Внучка прислала мне хризантемы. Стоят вторую неделю, только воду меняю. Открытку подписали красивым почерком, оставила себе.',
  },
  {
    name: 'Дмитрий',
    date: '3 октября 2026',
    rating: 4,
    text: 'Розы свежие, собрано аккуратно. Курьер приехал в конце интервала, а я ждал ближе к началу. Если время важно, лучше написать об этом в комментарии.',
  },
  {
    name: 'Ольга',
    date: '19 сентября 2026',
    rating: 5,
    text: 'Отправляла фаленопсис коллеге в офис на Немиге. На улице был ветер с дождём, но упаковали так, что ни один цветок не помялся.',
  },
  { name: 'Влад', date: '7 сентября 2026', rating: 5, text: 'Нужно было срочно извиниться. Взял «Карамельный» — помогло.' },
  {
    name: 'Наталья',
    date: '26 августа 2026',
    rating: 5,
    text: 'Мама живёт в Боровлянах, это уже за городом. Менеджер перезвонил, сразу назвал цену доставки, и букет привезли в тот же день.',
  },
];

export default function Home() {
  usePageTitle(null);
  const { products, loading } = useProducts();
  const hits = useMemo(
    () => [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 8),
    [products],
  );

  return (
    <>
      <aside className={styles.season} aria-label="Сезонная акция">
        <div className={`container ${styles.seasonInner}`}>
          <span>Ноябрь — сезон хризантем и сухоцветов. До 30 ноября скидки на пять позиций каталога.</span>
          <Link to="/catalog?sale=1">Смотреть</Link>
        </div>
      </aside>

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>Ежедневно 8:00–22:00 · Минск</p>
            <h1>Соберём букет и привезём за два часа</h1>
            <p className={styles.lead}>
              Перед отправкой пришлём фото, открытку положим бесплатно. На первый заказ — минус 10% по промокоду{' '}
              <strong>FLEUR10</strong>.
            </p>
            <div className={styles.heroActions}>
              <Link to="/catalog" className="btn btn-primary">
                Выбрать букет
              </Link>
              <Link to="/catalog?sale=1" className="btn btn-outline">
                Товары со скидкой
              </Link>
            </div>
            <p className={styles.today}>Сегодня доставили 37 заказов</p>
          </div>
          <div className={styles.heroImage}>
            <img src={HERO_IMAGE} alt="Витрина цветочного магазина с вёдрами свежих роз и пионов" />
          </div>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="categories-title">
        <h2 id="categories-title">Категории</h2>
        <ul className={styles.categories}>
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link to={`/catalog?category=${c.id}`} className={styles.category}>
                <img src={c.image} srcSet={imageSrcSet(c.image)} sizes="(min-width: 768px) 25vw, 50vw" alt="" loading="lazy" />
                <span>{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="occasions-title">
        <h2 id="occasions-title">Поводы</h2>
        <ul className={styles.occasions}>
          {OCCASIONS.map((o) => (
            <li key={o.title}>
              <Link to={o.to} className={styles.occasion}>
                <strong>{o.title}</strong>
                <span>{o.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="hits-title">
        <div className={styles.sectionHead}>
          <h2 id="hits-title">Хиты продаж</h2>
          <Link to="/catalog?sort=popular" className="btn btn-ghost">
            Смотреть все →
          </Link>
        </div>
        <ProductGrid products={hits} loading={loading} />
      </section>

      <section className={styles.benefitsWrap} aria-labelledby="benefits-title">
        <div className="container">
          <h2 id="benefits-title" className="visually-hidden">
            Условия доставки
          </h2>
          <ul className={styles.benefits}>
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li key={title} className={styles.benefit}>
                <span className={styles.benefitIcon}>
                  <Icon width={26} height={26} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="reviews-title">
        <h2 id="reviews-title">Отзывы покупателей</h2>
        <ul className={styles.reviews}>
          {REVIEWS.map((r) => (
            <li key={r.name} className={styles.review}>
              <figure>
                <div className={styles.stars} aria-label={`Оценка ${r.rating} из 5`}>
                  {Array.from({ length: r.rating }, (_, i) => (
                    <StarIcon key={i} width={16} height={16} />
                  ))}
                </div>
                <blockquote>{r.text}</blockquote>
                <figcaption>
                  {r.name} <span className={styles.reviewDate}>· {r.date}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="container">
        <div className={styles.cta}>
          <h2>Нужен букет на сегодня?</h2>
          <p>30 букетов, коробок и растений. Не можете выбрать — позвоните: +375 (29) 318-46-72.</p>
          <Link to="/catalog" className="btn btn-primary">
            Перейти в каталог
          </Link>
        </div>
      </section>
    </>
  );
}
