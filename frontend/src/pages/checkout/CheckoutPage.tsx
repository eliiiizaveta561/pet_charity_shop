import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Button, Divider, Grid, Paper, Stack, Typography, Zoom } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import { OrderTotals, useCart } from '@/entities/cart';
import { createOrder, CustomerData, Order } from '@/entities/order';
import CheckoutForm from '@/features/checkout/CheckoutForm';
import { formatPrice } from '@/shared/lib/format';
import MessageScreen from '@/shared/ui/MessageScreen';

export default function CheckoutPage() {
  const { items, itemsTotal, donation, total, charity, clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const donationInvalid = donation > 0 && charity === null;

  const handleSubmit = async (customer: CustomerData) => {
    const created = await createOrder({
      customer,
      total,
      donation,
      charityName: donation > 0 && charity ? charity.name : null,
    });
    setOrder(created);
    clear();
  };

  if (order) {
    return (
      <Stack className="fade-in-up" spacing={2} alignItems="flex-start" sx={{ maxWidth: 560 }}>
        <Zoom in style={{ transitionDelay: '150ms' }}>
          <CheckCircleIcon color="primary" sx={{ fontSize: 56 }} />
        </Zoom>
        <Typography variant="h2">Заказ №{order.number} оформлен</Typography>
        <Typography>Сумма заказа: {formatPrice(order.total)}.</Typography>
        {order.charityName && (
          <Typography>
            Пожертвование {formatPrice(order.donation)} будет передано: {order.charityName}. Спасибо!
          </Typography>
        )}
        <Button component={RouterLink} to="/catalog" variant="contained">
          Продолжить покупки
        </Button>
      </Stack>
    );
  }

  if (items.length === 0) {
    return (
      <MessageScreen
        title="Нечего оформлять"
        text="Сначала добавьте товары в корзину."
        actionLabel="В каталог"
        actionTo="/catalog"
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h2">Оформление заказа</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            {donationInvalid && (
              <Alert
                severity="warning"
                sx={{ mb: 2 }}
                action={
                  <Button color="inherit" size="small" component={RouterLink} to="/cart">
                    В корзину
                  </Button>
                }
              >
                Для пожертвования не выбрана организация.
              </Alert>
            )}
            <CheckoutForm disabled={donationInvalid} onSubmit={handleSubmit} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Ваш заказ
            </Typography>
            <Stack spacing={1}>
              {items.map(({ product, qty }) => (
                <Stack key={product.id} direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2">
                    {product.name} × {qty}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                    {formatPrice(product.price * qty)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <OrderTotals itemsTotal={itemsTotal} donation={donation} total={total} />
            {donation > 0 && charity && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Получатель пожертвования: {charity.name}, {charity.city}.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
