import { ApiError, request } from '@/shared/api/http';
import { Category, Product, ProductInput } from '../model/types';

export const fetchProducts = (): Promise<Product[]> => request<Product[]>('/products');

export const fetchCategories = (): Promise<Category[]> => request<Category[]>('/categories');

/** null, если товара нет: страница покажет «Товар не найден», а не ошибку. */
export async function fetchProduct(id: number): Promise<Product | null> {
  try {
    return await request<Product>(`/products/${id}`);
  } catch (error) {
    // 422 - в адресе не число, например /product/abc
    if (error instanceof ApiError && (error.status === 404 || error.status === 422)) return null;
    throw error;
  }
}

const toRequestBody = ({ categoryId, ...rest }: ProductInput) => ({ ...rest, category_id: categoryId });

export const createProduct = (input: ProductInput): Promise<Product> =>
  request<Product>('/products', { method: 'POST', body: toRequestBody(input) });

export const updateProduct = (id: number, input: ProductInput): Promise<Product> =>
  request<Product>(`/products/${id}`, { method: 'PATCH', body: toRequestBody(input) });

export const deleteProduct = (id: number): Promise<void> => request<void>(`/products/${id}`, { method: 'DELETE' });
