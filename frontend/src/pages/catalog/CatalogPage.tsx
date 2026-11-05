import { Button, Grid, Stack, Typography } from '@mui/material';
import { ProductCard, products } from '@/entities/product';
import AddToCartButton from '@/features/add-to-cart/AddToCartButton';
import ProductFilters from '@/features/filter-products/ProductFilters';
import { useProductFilters } from '@/features/filter-products/useProductFilters';
import EmptyState from '@/shared/ui/EmptyState';

export default function CatalogPage() {
  const filters = useProductFilters(products);

  return (
    <Stack spacing={3}>
      <Typography variant="h2">Каталог</Typography>
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
        <Grid container spacing={3}>
          {filters.visible.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard product={product} action={<AddToCartButton product={product} />} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
