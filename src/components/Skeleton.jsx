import styles from './Skeleton.module.css';

// Заглушка карточки товара на время загрузки
export default function Skeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.block} ${styles.image}`} />
      <div className={styles.body}>
        <div className={`${styles.block} ${styles.line}`} />
        <div className={`${styles.block} ${styles.lineShort}`} />
        <div className={`${styles.block} ${styles.button}`} />
      </div>
    </div>
  );
}
