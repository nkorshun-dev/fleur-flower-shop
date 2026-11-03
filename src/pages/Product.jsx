import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import QuantityControl from '../components/QuantityControl';
import { HeartIcon } from '../components/Icons';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES } from '../data/products';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../utils/formatPrice';
import NotFound from './NotFound';
import { imageSrcSet } from '../utils/imageSrcSet';
import styles from './Product.module.css';

const SIZE_LABELS = { S: 'S — небольшой', M: 'M — средний', L: 'L — большой' };

export default function Product() {
  const { slug } = useParams();
  const { products, loading, error, retry } = useProducts();
  const { add } = useCart();
  const favorites = useFavorites();
  const toast = useToast();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const product = products.find((p) => p.slug === slug);
  const related = useMemo(
    () => (product ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : []),
    [products, product],
  );

  // Переход на другой товар («Вам может понравиться»): сбрасываем фото и количество сразу,
  // в том же рендере, иначе на миг покажется несуществующее фото нового товара
  const [shownSlug, setShownSlug] = useState(slug);
  if (shownSlug !== slug) {
    setShownSlug(slug);
    setActiveImage(0);
    setQty(1);
  }

  usePageTitle(product?.name ?? (loading ? 'Загрузка' : error ? 'Ошибка загрузки' : 'Страница не найдена'));

  if (loading) {
    return (
      <div className={`container page ${styles.loading}`} aria-busy="true">
        <div className={styles.skeletonImage} />
        <p>Загружаем букет…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page">
        <p>Не удалось загрузить товар.</p>
        <button type="button" className="btn btn-primary" onClick={retry}>
          Повторить
        </button>
      </div>
    );
  }

  if (!product) return <NotFound />;

  const category = CATEGORIES.find((c) => c.id === product.category);
  const isFav = favorites.has(product.id);

  const addToCart = () => {
    add(product.id, qty);
    toast.show(`«${product.name}» × ${qty} в корзине`);
  };

  return (
    <div className="container page">
      <nav aria-label="Хлебные крошки" className={styles.crumbs}>
        <Link to="/">Главная</Link> / <Link to={`/catalog?category=${category.id}`}>{category.name}</Link> /{' '}
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img key={activeImage} src={product.images[activeImage]} alt={`${product.name}, фото ${activeImage + 1}`} />
          </div>
          <ul className={styles.thumbs} aria-label="Фотографии товара">
            {product.images.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Показать фото ${i + 1}`}
                  aria-pressed={i === activeImage}
                >
                  <img src={src} srcSet={imageSrcSet(src)} sizes="100px" alt="" loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.info}>
          {product.tags.length > 0 && <p className={styles.tags}>{product.tags.join(' · ')}</p>}
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.rating}>
            ★ {product.rating.toFixed(1).replace('.', ',')} · оценок: {product.reviews} · {category.name}
          </p>

          <p className={styles.price}>
            {formatPrice(product.price)}
            {product.oldPrice && (
              <s className={styles.oldPrice}>
                <span className="visually-hidden">Старая цена: </span>
                {formatPrice(product.oldPrice)}
              </s>
            )}
          </p>

          <p className={styles.description}>{product.description}</p>

          <dl className={styles.specs}>
            <div>
              <dt>Состав</dt>
              <dd>{product.composition.join(', ')}</dd>
            </div>
            <div>
              <dt>Размер</dt>
              <dd>
                {SIZE_LABELS[product.size]}, {product.dimensions}
              </dd>
            </div>
            <div>
              <dt>Наличие</dt>
              <dd className={product.inStock ? styles.inStock : styles.outStock}>
                {product.inStock ? 'В наличии, доставим сегодня' : 'Нет в наличии'}
              </dd>
            </div>
          </dl>

          <div className={styles.buy}>
            {product.inStock && <QuantityControl key={product.id} value={qty} onChange={setQty} />}
            <button type="button" className={`btn btn-primary ${styles.addBtn}`} onClick={addToCart} disabled={!product.inStock}>
              {product.inStock ? 'В корзину' : 'Нет в наличии'}
            </button>
            <button
              type="button"
              className={`btn btn-outline ${styles.favBtn}`}
              onClick={() => favorites.toggle(product.id)}
              aria-pressed={isFav}
            >
              <HeartIcon filled={isFav} width={18} height={18} />
              {isFav ? 'В избранном' : 'В избранное'}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-title">
          <h2 id="related-title">Вам может понравиться</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
