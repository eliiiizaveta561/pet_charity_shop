import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { Alert, Link, Paper, Stack, Typography } from '@mui/material';
import { useSession } from '@/entities/session';
import LoginForm from '@/features/auth/LoginForm';
import { useReturnPath } from '@/features/auth/useReturnPath';

export default function LoginPage() {
  const { user } = useSession();
  const navigate = useNavigate();
  const returnPath = useReturnPath();

  if (user) return <Navigate to={returnPath} replace />;

  return (
    <Stack spacing={3} sx={{ maxWidth: 440, mx: 'auto' }}>
      <Typography variant="h2">Вход</Typography>
      <Paper sx={{ p: 3 }}>
        <LoginForm onSuccess={() => navigate(returnPath, { replace: true })} />
      </Paper>
      <Typography>
        Нет аккаунта?{' '}
        <Link component={RouterLink} to="/register" state={{ from: returnPath }}>
          Зарегистрируйтесь
        </Link>
      </Typography>
      {import.meta.env.DEV && (
        <Alert severity="info">
          Демо-аккаунты из <code>seed.py</code>: admin@dobromarket.ru / admin12345 (администратор), anna@example.ru /
          anna12345 (покупатель).
        </Alert>
      )}
    </Stack>
  );
}
