import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories, Category, Product } from '@/entities/product';

export type CategoryFilter = Category | 'all';
export type Sort = 'default' | 'asc' | 'desc';

const isCategory = (value: string | null): value is Category => categories.includes(value as Category);
const isSort = (value: string | null): value is Sort => value === 'asc' || value === 'desc';

/** Значения фильтров хранятся в адресе: они переживают переход на товар и возврат назад. */
export function useProductFilters(products: Product[]) {
  const [params, setParams] = useSearchParams();

  const query = params.get('q') ?? '';
  const rawCategory = params.get('category');
  const category: CategoryFilter = isCategory(rawCategory) ? rawCategory : 'all';
  const rawSort = params.get('sort');
  const sort: Sort = isSort(rawSort) ? rawSort : 'default';

  const setParam = (key: string, value: string, defaultValue: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === defaultValue) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );

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

  return {
    query,
    setQuery: (value: string) => setParam('q', value, ''),
    category,
    setCategory: (value: CategoryFilter) => setParam('category', value, 'all'),
    sort,
    setSort: (value: Sort) => setParam('sort', value, 'default'),
    reset: () => setParams({}, { replace: true }),
    visible,
  };
}

export type ProductFiltersState = ReturnType<typeof useProductFilters>;
