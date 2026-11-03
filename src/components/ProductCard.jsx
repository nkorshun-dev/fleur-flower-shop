import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import { imageSrcSet } from '../utils/imageSrcSet';
import { HeartIcon } from './Icons';
import styles from './ProductCard.module.css';

const TAG_CLASS = { 'хит': 'tagHit', 'новинка': 'tagNew', 'скидка': 'tagSale' };

export default function ProductCard({ product }) {
  const { add } = useCart();
  const favorites = useFavorites();
  const toast = useToast();
  const isFav = favorites.has(product.id);

  const addToCart = () => {
    add(product.id);
    toast.show(`«${product.name}» добавлен в корзину`);
  };

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.slug}`} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
        <img src={product.images[0]} srcSet={imageSrcSet(product.images[0])} sizes="(min-width: 1024px) 300px, 50vw" alt="" loading="lazy" className={styles.image} />
        {product.images[1] && <img src={product.images[1]} srcSet={imageSrcSet(product.images[1])} sizes="(min-width: 1024px) 300px, 50vw" alt="" loading="lazy" className={styles.imageAlt} />}
      </Link>

      {product.tags.length > 0 && (
        <ul className={styles.tags} aria-label="Метки">
          {product.tags.map((tag) => (
            <li key={tag} className={`${styles.tag} ${styles[TAG_CLASS[tag]] ?? ''}`}>
              {tag}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className={`${styles.fav} ${isFav ? styles.favActive : ''}`}
        aria-pressed={isFav}
        aria-label={isFav ? `Убрать «${product.name}» из избранного` : `Добавить «${product.name}» в избранное`}
        onClick={() => favorites.toggle(product.id)}
      >
        <HeartIcon filled={isFav} />
      </button>

      <div className={styles.body}>
        <h3 className={styles.name}>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className={styles.meta}>
          Размер {product.size} · ★ {product.rating.toFixed(1).replace('.', ',')} ({product.reviews})
        </p>
        <div className={styles.footer}>
          <p className={styles.price}>
            {formatPrice(product.price)}
            {product.oldPrice && (
              <s className={styles.oldPrice}>
                <span className="visually-hidden">Старая цена: </span>
                {formatPrice(product.oldPrice)}
              </s>
            )}
          </p>
          {product.inStock ? (
            <button type="button" className={`btn btn-primary ${styles.add}`} onClick={addToCart}>
              В корзину
            </button>
          ) : (
            <span className={styles.outOfStock}>Нет в наличии</span>
          )}
        </div>
      </div>
    </article>
  );
}
