import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Страница не найдена');
  return (
    <div className="container page">
      <EmptyState icon="❀" title="Страница не найдена" titleAs="h1" text="Кажется, этот букет уже разобрали. Но у нас есть много других!">
        <Link to="/" className="btn btn-primary">
          На главную
        </Link>
        <Link to="/catalog" className="btn btn-outline">
          В каталог
        </Link>
      </EmptyState>
    </div>
  );
}
