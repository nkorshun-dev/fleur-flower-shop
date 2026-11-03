import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ProductGrid from '../components/ProductGrid';
import { useFavorites } from '../context/FavoritesContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProducts } from '../hooks/useProducts';

export default function Favorites() {
  usePageTitle('Избранное');
  const { ids } = useFavorites();
  const { products, loading, error, retry } = useProducts();
  const saved = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container page">
      <h1 className="page-title">Избранное</h1>
      {ids.length === 0 ? (
        <EmptyState icon="♡" title="Здесь пока пусто" text="Нажмите на сердечко у товара, чтобы сохранить его сюда.">
          <Link to="/catalog" className="btn btn-primary">
            Перейти в каталог
          </Link>
        </EmptyState>
      ) : error ? (
        <EmptyState icon="!" title="Не удалось загрузить избранное" text="Проверьте подключение к интернету и попробуйте ещё раз.">
          <button type="button" className="btn btn-primary" onClick={retry}>
            Повторить
          </button>
        </EmptyState>
      ) : (
        <ProductGrid products={saved} loading={loading} skeletonCount={Math.min(ids.length, 8)} />
      )}
    </div>
  );
}
