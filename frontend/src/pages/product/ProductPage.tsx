import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Chip, Grid, Link, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { categoryLabels, ProductImage, products } from '@/entities/product';
import AddToCartButton from '@/features/add-to-cart/AddToCartButton';
import { formatPrice } from '@/shared/lib/format';
import MessageScreen from '@/shared/ui/MessageScreen';
import QuantityStepper from '@/shared/ui/QuantityStepper';

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const [qty, setQty] = useState(1);
  const [notice, setNotice] = useState(false);

  if (!product) {
    return (
      <MessageScreen
        title="Товар не найден"
        text="Возможно, ссылка устарела. Вернитесь в каталог и выберите товар заново."
        actionLabel="В каталог"
        actionTo="/catalog"
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Breadcrumbs>
        <Link component={RouterLink} to="/catalog" underline="hover" color="inherit">
          Каталог
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ProductImage product={product} height={{ xs: 240, md: 380 }} fontSize={{ xs: 96, md: 150 }} borderRadius={4} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Box>
              <Chip size="small" label={categoryLabels[product.category]} sx={{ mb: 1 }} />
              <Typography variant="h2">{product.name}</Typography>
              <Typography color="text.secondary">Бренд: {product.brand}</Typography>
            </Box>
            <Typography>{product.description}</Typography>
            <Typography variant="h3">{formatPrice(product.price)}</Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <QuantityStepper value={qty} onChange={setQty} />
              <AddToCartButton
                product={product}
                qty={qty}
                size="large"
                label="Добавить в корзину"
                onAdded={() => setNotice(true)}
              />
            </Stack>

            <Paper sx={{ p: 2, bgcolor: 'rgba(233,162,59,0.12)' }}>
              <Typography variant="body2">
                К заказу можно добавить пожертвование в приют. Организацию выбирают на карте — перед оформлением заказа.
              </Typography>
              <Button component={RouterLink} to="/charities" size="small" sx={{ px: 0, mt: 0.5 }}>
                Выбрать организацию
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={notice}
        autoHideDuration={2500}
        onClose={() => setNotice(false)}
        message="Товар добавлен в корзину"
        action={
          <Button color="secondary" size="small" component={RouterLink} to="/cart">
            Открыть корзину
          </Button>
        }
      />
    </Stack>
  );
}
