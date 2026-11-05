import { Button, Stack, Typography } from '@mui/material';
import { fetchProducts, Product, ProductGrid, ProductGridSkeleton } from '@/entities/product';
import AddToCartButton from '@/features/add-to-cart/AddToCartButton';
import ProductFilters from '@/features/filter-products/ProductFilters';
import { useProductFilters } from '@/features/filter-products/useProductFilters';
import { useAsyncData } from '@/shared/lib/useAsyncData';
import AsyncContent from '@/shared/ui/AsyncContent';
import EmptyState from '@/shared/ui/EmptyState';

function FilteredProducts({ products }: { products: Product[] }) {
  const filters = useProductFilters(products);

  return (
    <>
      <ProductFilters filters={filters} />
      {filters.visible.length === 0 ? (
        <EmptyState
          title="Ничего не найдено"
          text="Измените запрос или выберите другую категорию."
          action={
            <Button variant="outlined" onClick={filters.reset}>
              Сбросить фильтры
            </Button>
          }
        />
      ) : (
        <ProductGrid products={filters.visible} renderAction={(product) => <AddToCartButton product={product} />} />
      )}
    </>
  );
}

export default function CatalogPage() {
  const { state, reload } = useAsyncData(fetchProducts, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h2">Каталог</Typography>
      <AsyncContent
        state={state}
        onRetry={reload}
        loading={<ProductGridSkeleton />}
        isEmpty={(products) => products.length === 0}
        empty={<EmptyState title="Каталог пуст" text="Товары пока не добавлены. Загляните позже." />}
      >
        {(products) => <FilteredProducts products={products} />}
      </AsyncContent>
    </Stack>
  );
}
