import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { OrderTotals, useCart } from '@/entities/cart';
import DonationPanel from '@/features/donate/DonationPanel';
import CartItemRow from '@/features/edit-cart/CartItemRow';
import MessageScreen from '@/shared/ui/MessageScreen';

export default function CartPage() {
  const { items, itemsTotal, donation, total, charity } = useCart();
  const navigate = useNavigate();
  const [amountValid, setAmountValid] = useState(true);

  if (items.length === 0) {
    return (
      <MessageScreen
        title="Корзина пуста"
        text="Добавьте товары из каталога, чтобы оформить заказ."
        actionLabel="Перейти в каталог"
        actionTo="/catalog"
      />
    );
  }

  const donationInvalid = donation > 0 && charity === null;

  return (
    <Stack spacing={3}>
      <Typography variant="h2">Корзина</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <DonationPanel onValidityChange={setAmountValid} />
            <Divider sx={{ my: 2 }} />
            <OrderTotals itemsTotal={itemsTotal} donation={donation} total={total} />
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{ mt: 2 }}
              disabled={donationInvalid || !amountValid}
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
