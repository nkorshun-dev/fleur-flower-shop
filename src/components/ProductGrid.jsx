import ProductCard from './ProductCard';
import Skeleton from './Skeleton';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products, loading = false, skeletonCount = 8 }) {
  if (loading) {
    return (
      <div className={styles.grid} aria-busy="true" aria-label="Загрузка товаров">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <ul className={styles.grid}>
      {products.map((p) => (
        <li key={p.id} className={styles.item}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
