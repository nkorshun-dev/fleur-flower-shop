const whole = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
const withKopecks = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// 129 → «129 BYN», 116.1 → «116,10 BYN»
export const formatPrice = (value) => {
  const rounded = Math.round(value * 100) / 100;
  return `${(Number.isInteger(rounded) ? whole : withKopecks).format(rounded)} BYN`;
};
