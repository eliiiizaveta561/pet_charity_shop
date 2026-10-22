import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Divider, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { products } from '../data/products';
import { formatPrice } from '../utils';
import { useCart } from '../context/CartContext';
import DonationPanel from '../components/DonationPanel';

export default function CartPage() {
  const { items, itemsTotal, donation, total, charityId, setQty, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h2">Корзина пуста</Typography>
        <Typography color="text.secondary">Добавьте товары из каталога, чтобы оформить заказ.</Typography>
        <Button component={RouterLink} to="/catalog" variant="contained">
          Перейти в каталог
        </Button>
      </Stack>
    );
  }

  const donationInvalid = donation > 0 && charityId === null;

  return (
    <Stack spacing={3}>
      <Typography variant="h2">Корзина</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Stack spacing={2}>
            {items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              return (
                <Paper key={item.productId} sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        bgcolor: product.tint,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        flexShrink: 0,
                      }}
                    >
                      {product.emoji}
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        component={RouterLink}
                        to={`/product/${product.id}`}
                        sx={{ fontWeight: 700, color: 'text.primary', textDecoration: 'none' }}
                      >
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatPrice(product.price)} за шт.
                      </Typography>
                    </Box>
                    <Stack direction="row" alignItems="center">
                      <IconButton size="small" aria-label="Уменьшить" onClick={() => setQty(item.productId, item.qty - 1)}>
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{item.qty}</Typography>
                      <IconButton size="small" aria-label="Увеличить" onClick={() => setQty(item.productId, item.qty + 1)}>
                        <AddIcon />
                      </IconButton>
                    </Stack>
                    <Typography sx={{ minWidth: 80, textAlign: 'right', fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
                      {formatPrice(product.price * item.qty)}
                    </Typography>
                    <IconButton aria-label="Удалить товар" onClick={() => removeItem(item.productId)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <DonationPanel />
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Товары</Typography>
                <Typography>{formatPrice(itemsTotal)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Пожертвование</Typography>
                <Typography>{formatPrice(donation)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Итого</Typography>
                <Typography variant="h6">{formatPrice(total)}</Typography>
              </Stack>
            </Stack>
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{ mt: 2 }}
              disabled={donationInvalid}
              onClick={() => navigate('/checkout')}
            >
              Оформить заказ
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
