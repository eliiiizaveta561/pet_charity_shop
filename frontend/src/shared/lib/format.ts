export const formatPrice = (value: number): string =>
  `${value.toLocaleString('ru-RU')} ₽`;

/** 18 ноября 2026, 14:05 */
export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
