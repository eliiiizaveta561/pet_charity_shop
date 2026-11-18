import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { Link, Paper, Stack, Typography } from '@mui/material';
import { useSession } from '@/entities/session';
import RegisterForm from '@/features/auth/RegisterForm';
import { useReturnPath } from '@/features/auth/useReturnPath';
import { useNotify } from '@/shared/ui/notifications';

export default function RegisterPage() {
  const { user } = useSession();
  const navigate = useNavigate();
  const notify = useNotify();
  const returnPath = useReturnPath();

  if (user) return <Navigate to={returnPath} replace />;

  const handleSuccess = () => {
    notify({ message: 'Аккаунт создан, вы вошли в систему' });
    navigate(returnPath, { replace: true });
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 440, mx: 'auto' }}>
      <Typography variant="h2">Регистрация</Typography>
      <Paper sx={{ p: 3 }}>
        <RegisterForm onSuccess={handleSuccess} />
      </Paper>
      <Typography>
        Уже есть аккаунт?{' '}
        <Link component={RouterLink} to="/login" state={{ from: returnPath }}>
          Войдите
        </Link>
      </Typography>
    </Stack>
  );
}
