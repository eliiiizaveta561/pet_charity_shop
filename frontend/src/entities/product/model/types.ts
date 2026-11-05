export type Category = 'dogs' | 'cats' | 'birds' | 'rodents' | 'fish';

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: Category;
  price: number;
  description: string;
  emoji: string;
  tint: string;
}

export const categoryLabels: Record<Category, string> = {
  dogs: 'Собаки',
  cats: 'Кошки',
  birds: 'Птицы',
  rodents: 'Грызуны',
  fish: 'Рыбки',
};

export const categories = Object.keys(categoryLabels) as Category[];
