import { demoRequest } from '@/shared/api/demo';
import { Product } from '../model/types';
import { products } from './products.data';

export const fetchProducts = (): Promise<Product[]> => demoRequest(() => products, []);

export const fetchProduct = (id: number): Promise<Product | null> =>
  demoRequest(() => products.find((p) => p.id === id) ?? null, null);
