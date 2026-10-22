import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Chip, Grid, IconButton, Link, Paper, Snackbar, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { categoryLabels, products } from '../data/products';
import { formatPrice } from '../utils';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [notice, setNotice] = useState(false);

  if (!product) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h2">Товар не найден</Typography>
        <Typography color="text.secondary">Возможно, ссылка устарела. Вернитесь в каталог и выберите товар заново.</Typography>
        <Button component={RouterLink} to="/catalog" variant="contained">
          В каталог
        </Button>
      </Stack>
    );
  }

  const handleAdd = () => {
    addItem(product.id, qty);
    setNotice(true);
  };

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
          <Box
            sx={{
              bgcolor: product.tint,
              borderRadius: 4,
              height: { xs: 240, md: 380 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: { xs: 96, md: 150 },
            }}
          >
            {product.emoji}
          </Box>
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
              <Stack direction="row" alignItems="center">
                <IconButton aria-label="Уменьшить количество" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ minWidth: 32, textAlign: 'center', fontWeight: 700 }}>{qty}</Typography>
                <IconButton aria-label="Увеличить количество" onClick={() => setQty((q) => q + 1)}>
                  <AddIcon />
                </IconButton>
              </Stack>
              <Button variant="contained" size="large" onClick={handleAdd}>
                Добавить в корзину
              </Button>
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
