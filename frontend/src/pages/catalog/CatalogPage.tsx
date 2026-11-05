import { Box, Grid, Stack, Typography } from '@mui/material';
import { ProductCard, products } from '@/entities/product';
import AddToCartButton from '@/features/add-to-cart/AddToCartButton';
import ProductFilters from '@/features/filter-products/ProductFilters';
import { useProductFilters } from '@/features/filter-products/useProductFilters';

export default function CatalogPage() {
  const filters = useProductFilters(products);

  return (
    <Stack spacing={3}>
      <Typography variant="h2">Каталог</Typography>
      <ProductFilters filters={filters} />

      {filters.visible.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="h6">Ничего не найдено</Typography>
          <Typography color="text.secondary">Измените запрос или выберите другую категорию.</Typography>
        </Box>
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
