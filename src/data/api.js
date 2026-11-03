import { products } from './products';

const delay = () => 300 + Math.random() * 300;

// Имитация запроса к серверу. Добавьте ?error=1 к адресу, чтобы увидеть состояние ошибки:
// первая загрузка упадёт, а «Повторить» (isRetry) уже сработает.
export function fetchProducts({ isRetry = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!isRetry && new URLSearchParams(window.location.search).has('error')) {
        reject(new Error('Не удалось загрузить товары'));
      } else {
        resolve(products);
      }
    }, delay());
  });
}
