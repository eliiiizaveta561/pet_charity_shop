import { Alert, Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import type { CustomerData } from '@/entities/order';
import { useForm } from '@/shared/lib/useForm';
import { FormRules, matches, minLength, required } from '@/shared/lib/validation';

const rules: FormRules<CustomerData> = {
  name: [
    required('Введите имя'),
    minLength(2, 'Имя должно содержать не меньше 2 символов'),
    matches(/^[A-Za-zА-Яа-яЁё\s'-]+$/, 'Имя может содержать только буквы, пробел и дефис'),
  ],
  phone: [
    required('Введите телефон'),
    matches(/^(\+7|7|8)[\s()-]*(\d[\s()-]*){10}$/, 'Введите телефон в формате +7 900 123-45-67'),
  ],
  address: [required('Введите адрес доставки'), minLength(5, 'Укажите город, улицу и дом')],
};

interface CheckoutFormProps {
  disabled?: boolean;
  onSubmit: (customer: CustomerData) => void | Promise<void>;
}

export default function CheckoutForm({ disabled = false, onSubmit }: CheckoutFormProps) {
  const form = useForm<CustomerData>({
    initialValues: { name: '', phone: '', address: '' },
    rules,
    onSubmit,
  });

  return (
    <Box component="form" onSubmit={form.handleSubmit} noValidate>
      <Stack spacing={2}>
        <TextField label="Имя" autoComplete="name" required fullWidth {...form.field('name')} />
        <TextField
          label="Телефон"
          type="tel"
          autoComplete="tel"
          placeholder="+7 900 123-45-67"
          required
          fullWidth
          {...form.field('phone')}
        />
        <TextField
          label="Адрес доставки"
          autoComplete="street-address"
          required
          multiline
          minRows={2}
          fullWidth
          {...form.field('address')}
        />
        {form.submitError && <Alert severity="error">{form.submitError}</Alert>}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={disabled || form.submitting}
          startIcon={form.submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
        >
          {form.submitting ? 'Отправляем заказ…' : 'Подтвердить заказ'}
        </Button>
      </Stack>
    </Box>
  );
}
