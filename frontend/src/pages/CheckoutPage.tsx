import { FormEvent, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Divider, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import { products } from '../data/products';
import { charities } from '../data/charities';
import { formatPrice } from '../utils';
import { useCart } from '../context/CartContext';

interface Order {
  number: number;
  total: number;
  donation: number;
  charityName: string | null;
}

interface Errors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function CheckoutPage() {
  const { items, itemsTotal, donation, total, charityId, clear } = useCart();
  const charity = charities.find((c) => c.id === charityId);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [order, setOrder] = useState<Order | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 2) next.name = 'Введите имя';
    if (!/^[+\d][\d\s()-]{9,}$/.test(phone.trim())) next.phone = 'Введите телефон, например +7 900 123-45-67';
    if (address.trim().length < 5) next.address = 'Введите адрес доставки';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setOrder({
      number: Math.floor(1000 + Math.random() * 9000),
      total,
      donation,
      charityName: donation > 0 && charity ? charity.name : null,
    });
    clear();
  };

  if (order) {
    return (
      <Stack spacing={2} alignItems="flex-start" sx={{ maxWidth: 560 }}>
        <CheckCircleIcon color="primary" sx={{ fontSize: 56 }} />
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
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h2">Нечего оформлять</Typography>
        <Typography color="text.secondary">Сначала добавьте товары в корзину.</Typography>
        <Button component={RouterLink} to="/catalog" variant="contained">
          В каталог
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h2">Оформление заказа</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  label="Имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  fullWidth
                />
                <TextField
                  label="Телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                  fullWidth
                />
                <TextField
                  label="Адрес доставки"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  error={Boolean(errors.address)}
                  helperText={errors.address}
                  multiline
                  minRows={2}
                  fullWidth
                />
                <Button type="submit" variant="contained" size="large">
                  Подтвердить заказ
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Ваш заказ
            </Typography>
            <Stack spacing={1}>
              {items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <Stack key={item.productId} direction="row" justifyContent="space-between" spacing={2}>
                    <Typography variant="body2">
                      {product.name} × {item.qty}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {formatPrice(product.price * item.qty)}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
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
