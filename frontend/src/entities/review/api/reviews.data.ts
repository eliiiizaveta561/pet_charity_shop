import { Review } from '../model/types';

export const reviews: Review[] = [
  { id: 1, productId: 1, author: 'Анна', rating: 5, text: 'Собака ест с удовольствием, упаковки хватает надолго.' },
  { id: 2, productId: 1, author: 'Игорь', rating: 4, text: 'Хороший состав, но гранулы крупноваты для небольшой собаки.' },
  { id: 3, productId: 4, author: 'Мария', rating: 5, text: 'Кошка съедает всё и просит добавки.' },
  { id: 4, productId: 5, author: 'Олег', rating: 3, text: 'Столбик устойчивый, но кот не сразу к нему привык.' },
];
