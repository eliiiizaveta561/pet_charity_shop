import { Product } from '../model/types';

export const products: Product[] = [
  { id: 1, name: 'Сухой корм для взрослых собак', brand: 'Четыре лапы', category: 'dogs', price: 1890, description: 'Полнорационный корм с курицей и рисом для собак средних пород. Упаковка 3 кг.', emoji: '🐕', tint: '#fde9c8' },
  { id: 2, name: 'Лакомство-косточка для чистки зубов', brand: 'Хвостик', category: 'dogs', price: 320, description: 'Жевательные косточки помогают убирать налёт. В упаковке 7 штук.', emoji: '🦴', tint: '#e6f2ee' },
  { id: 3, name: 'Поводок-рулетка 5 м', brand: 'Зоомир', category: 'dogs', price: 780, description: 'Прочная лента, удобная ручка и кнопка блокировки. Для собак до 25 кг.', emoji: '🦮', tint: '#dfeaf7' },
  { id: 4, name: 'Влажный корм для кошек, набор 12 шт.', brand: 'For cats', category: 'cats', price: 1150, description: 'Паучи с индейкой в соусе. Подходит для кошек с 1 года.', emoji: '🐈', tint: '#f6e0e6' },
  { id: 5, name: 'Когтеточка-столбик', brand: 'For cats', category: 'cats', price: 1490, description: 'Высота 60 см, покрытие из джута, устойчивое основание.', emoji: '🐱', tint: '#fde9c8' },
  { id: 6, name: 'Наполнитель 10 л', brand: 'Чистая лапка', category: 'cats', price: 690, description: 'Минеральный наполнитель без резкого запаха, хорошо впитывает влагу.', emoji: '🧺', tint: '#e6f2ee' },
  { id: 7, name: 'Корм для волнистых попугаев', brand: 'Зоомир', category: 'birds', price: 260, description: 'Зерновая смесь с минеральной добавкой. Упаковка 500 г.', emoji: '🦜', tint: '#dff3d9' },
  { id: 8, name: 'Клетка для хомяка с колесом', brand: 'Домашние животные', category: 'rodents', price: 2450, description: 'Комплект: клетка, колесо, поилка и домик. Размер 40×30×25 см.', emoji: '🐹', tint: '#fde9c8' },
  { id: 9, name: 'Хлопья для аквариумных рыб', brand: 'Друг человека', category: 'fish', price: 210, description: 'Сбалансированный корм для большинства пресноводных рыб. 100 мл.', emoji: '🐡', tint: '#dfeaf7' },
  { id: 10, name: 'Лежанка мягкая, размер M', brand: 'Четыре лапы', category: 'dogs', price: 1640, description: 'Съёмный чехол можно стирать при 30 °C.', emoji: '💤', tint: '#f6e0e6' },
];
