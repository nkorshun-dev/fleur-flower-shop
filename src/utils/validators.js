export const PHONE_PREFIX = '+375';

export const TIME_SLOTS = ['09:00–11:00', '11:00–13:00', '13:00–15:00', '15:00–17:00', '17:00–19:00', '19:00–21:00', '20:00–22:00'];

// Приводит ввод к виду +375 (29) 123-45-67.
// Скобки и дефисы ставим только перед следующей цифрой — иначе Backspace «упирается» в них.
export function formatPhone(input) {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('375')) digits = digits.slice(3);
  else if ('375'.startsWith(digits)) digits = ''; // стёрли часть префикса +375
  else if (digits.length === 11 && digits.startsWith('80')) digits = digits.slice(2); // вставили 80 29 123-45-67
  digits = digits.slice(0, 9);

  let result = PHONE_PREFIX;
  if (digits.length > 0) result += ` (${digits.slice(0, 2)}`;
  if (digits.length > 2) result += `) ${digits.slice(2, 5)}`;
  if (digits.length > 5) result += `-${digits.slice(5, 7)}`;
  if (digits.length > 7) result += `-${digits.slice(7, 9)}`;
  return result;
}

const toISODate = (d) => {
  const local = new Date(d);
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().slice(0, 10);
};

// Интервалы, на которые ещё можно заказать: на сегодня — только те, что не начались
export function availableSlots(date, now = new Date()) {
  if (date !== toISODate(now)) return TIME_SLOTS;
  return TIME_SLOTS.filter((slot) => Number(slot.slice(0, 2)) > now.getHours());
}

// Самая ранняя дата доставки: сегодня, а если все интервалы на сегодня прошли — завтра
export function minDeliveryDate(now = new Date()) {
  const today = toISODate(now);
  if (availableSlots(today, now).length > 0) return today;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toISODate(tomorrow);
}

const LETTERS = /\p{L}/gu;

export function validateCheckout(values, now = new Date()) {
  const errors = {};
  if ((values.name.match(LETTERS) ?? []).length < 2) errors.name = 'Укажите имя (минимум 2 буквы)';
  if (!/^\+375 \((25|29|33|44)\) \d{3}-\d{2}-\d{2}$/.test(values.phone)) {
    errors.phone = 'Введите номер полностью, код оператора 25, 29, 33 или 44';
  }
  if (values.address.trim().length < 5) errors.address = 'Укажите улицу, дом и квартиру';
  if (!values.date) errors.date = 'Выберите дату доставки';
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) errors.date = 'Введите дату полностью';
  else if (values.date < minDeliveryDate(now)) errors.date = 'Дата не может быть в прошлом';
  if (!values.time) errors.time = 'Выберите интервал доставки';
  else if (values.date && !availableSlots(values.date, now).includes(values.time)) {
    errors.time = 'Этот интервал уже прошёл, выберите другой';
  }
  if (values.card.length > 200) errors.card = 'Не больше 200 символов';
  if (!values.payment) errors.payment = 'Выберите способ оплаты';
  return errors;
}
