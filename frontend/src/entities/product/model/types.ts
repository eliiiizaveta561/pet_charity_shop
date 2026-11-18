export interface Category {
  id: number;
  name: string;
}

/** Формат совпадает с ответом GET /api/products. */
export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  emoji: string;
  category: Category;
}

/** Данные формы создания и редактирования товара. */
export interface ProductInput {
  name: string;
  brand: string;
  description: string;
  price: number;
  emoji: string;
  categoryId: number;
}

const tints = ['#fde9c8', '#e6f2ee', '#dfeaf7', '#f6e0e6', '#dff3d9'];

/** Цвет фона карточки. В БД его нет, поэтому выбираем по id: у товара он всегда один и тот же. */
export const productTint = (productId: number): string => tints[productId % tints.length];
