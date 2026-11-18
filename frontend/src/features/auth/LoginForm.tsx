import { Alert, Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import { LoginData, useSession } from '@/entities/session';
import { useForm } from '@/shared/lib/useForm';
import { EMAIL_PATTERN, FormRules, matches, required } from '@/shared/lib/validation';

const rules: FormRules<LoginData> = {
  email: [required('Введите почту'), matches(EMAIL_PATTERN, 'Введите почту в формате name@example.ru')],
  password: [required('Введите пароль')],
};

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useSession();
  const form = useForm<LoginData>({
    initialValues: { email: '', password: '' },
    rules,
    onSubmit: async (values) => {
      await login({ email: values.email.trim(), password: values.password });
      onSuccess();
    },
  });

  return (
    <Box component="form" onSubmit={form.handleSubmit} noValidate>
      <Stack spacing={2}>
        <TextField label="Почта" type="email" autoComplete="email" required fullWidth {...form.field('email')} />
        <TextField
          label="Пароль"
          type="password"
          autoComplete="current-password"
          required
          fullWidth
          {...form.field('password')}
        />
        {form.submitError && <Alert severity="error">{form.submitError}</Alert>}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={form.submitting}
          startIcon={form.submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
        >
          Войти
        </Button>
      </Stack>
    </Box>
  );
}
