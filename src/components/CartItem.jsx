import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import QuantityControl from './QuantityControl';
import { TrashIcon } from './Icons';
import { imageSrcSet } from '../utils/imageSrcSet';
import styles from './CartItem.module.css';

export default function CartItem({ line, onQtyChange, onRemove }) {
  const { product, qty } = line;

  return (
    <li className={styles.item}>
      <Link to={`/product/${product.slug}`} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
        <img src={product.images[0]} srcSet={imageSrcSet(product.images[0])} sizes="120px" alt="" loading="lazy" className={styles.image} />
      </Link>
      <div className={styles.info}>
        <h3 className={styles.name}>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className={styles.meta}>
          Размер {product.size} · {formatPrice(product.price)} / шт.
        </p>
        <div className={styles.controls}>
          <QuantityControl value={qty} onChange={onQtyChange} label={`Количество «${product.name}»`} />
          <p className={styles.sum}>{formatPrice(product.price * qty)}</p>
        </div>
      </div>
      <button type="button" className={styles.remove} onClick={onRemove} aria-label={`Удалить «${product.name}» из корзины`}>
        <TrashIcon />
      </button>
    </li>
  );
}
