import { FormEvent, useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import type { CustomerData } from '@/entities/order';

type Errors = Partial<Record<keyof CustomerData, string>>;

interface CheckoutFormProps {
  onSubmit: (customer: CustomerData) => void;
}

export default function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 2) next.name = 'Введите имя';
    if (!/^[+\d][\d\s()-]{9,}$/.test(phone.trim())) next.phone = 'Введите телефон, например +7 900 123-45-67';
    if (address.trim().length < 5) next.address = 'Введите адрес доставки';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({ name, phone, address });
  };

  return (
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
  );
}
