import { Alert, Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import { useSession } from '@/entities/session';
import { useForm } from '@/shared/lib/useForm';
import { EMAIL_PATTERN, FormRules, matches, maxLength, minLength, required, sameAs } from '@/shared/lib/validation';

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

// Те же правила, что на сервере (schemas.RegisterRequest): ошибку видно сразу, без запроса
const rules: FormRules<RegisterValues> = {
  name: [required('Введите имя'), minLength(2, 'Имя должно содержать не меньше 2 символов')],
  email: [required('Введите почту'), matches(EMAIL_PATTERN, 'Введите почту в формате name@example.ru')],
  password: [
    required('Придумайте пароль'),
    minLength(8, 'Пароль должен содержать не меньше 8 символов'),
    maxLength(128, 'Пароль слишком длинный'),
    matches(/[A-Za-zА-Яа-яЁё]/, 'Добавьте в пароль хотя бы одну букву'),
    matches(/\d/, 'Добавьте в пароль хотя бы одну цифру'),
  ],
  confirm: [required('Повторите пароль'), sameAs('password', 'Пароли не совпадают')],
};

interface RegisterFormProps {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register } = useSession();
  const form = useForm<RegisterValues>({
    initialValues: { name: '', email: '', password: '', confirm: '' },
    rules,
    onSubmit: async ({ name, email, password }) => {
      await register({ name: name.trim(), email: email.trim(), password });
      onSuccess();
    },
  });

  return (
    <Box component="form" onSubmit={form.handleSubmit} noValidate>
      <Stack spacing={2}>
        <TextField label="Имя" autoComplete="name" required fullWidth {...form.field('name')} />
        <TextField label="Почта" type="email" autoComplete="email" required fullWidth {...form.field('email')} />
        <TextField
          label="Пароль"
          type="password"
          autoComplete="new-password"
          required
          fullWidth
          {...form.field('password')}
          helperText={form.errorOf('password') ?? 'Не меньше 8 символов, буквы и цифры'}
        />
        <TextField
          label="Повторите пароль"
          type="password"
          autoComplete="new-password"
          required
          fullWidth
          {...form.field('confirm')}
        />
        {form.submitError && <Alert severity="error">{form.submitError}</Alert>}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={form.submitting}
          startIcon={form.submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
        >
          Зарегистрироваться
        </Button>
      </Stack>
    </Box>
  );
}
