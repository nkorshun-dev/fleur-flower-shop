// Фото с Unsplash в двух размерах: браузер сам выберет 400 или 800 px по ширине экрана
export const imageSrcSet = (url) =>
  [400, 800].map((w) => `${url.replace('w=800&h=1000', `w=${w}&h=${(w * 5) / 4}`)} ${w}w`).join(', ');
