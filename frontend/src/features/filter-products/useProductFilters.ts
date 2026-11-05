import { useMemo, useState } from 'react';
import type { Category, Product } from '@/entities/product';

export type CategoryFilter = Category | 'all';
export type Sort = 'default' | 'asc' | 'desc';

export function useProductFilters(products: Product[]) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [sort, setSort] = useState<Sort>('default');

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (text === '' || p.name.toLowerCase().includes(text) || p.brand.toLowerCase().includes(text)),
    );
    if (sort === 'asc') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'desc') return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, query, category, sort]);

  return { query, setQuery, category, setCategory, sort, setSort, visible };
}

export type ProductFiltersState = ReturnType<typeof useProductFilters>;
