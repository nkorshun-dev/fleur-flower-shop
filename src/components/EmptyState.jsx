import styles from './EmptyState.module.css';

export default function EmptyState({ icon = '✿', title, titleAs: Title = 'h2', text, children }) {
  return (
    <div className={styles.empty}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <Title className={styles.title}>{title}</Title>
      {text && <p className={styles.text}>{text}</p>}
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
}
