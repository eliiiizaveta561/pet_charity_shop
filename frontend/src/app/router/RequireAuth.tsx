import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { Role, useSession } from '@/entities/session';
import MessageScreen from '@/shared/ui/MessageScreen';

interface RequireAuthProps {
  /** Если указана роль, страница доступна только ей. */
  role?: Role;
  children: ReactNode;
}

/**
 * Закрывает страницу от гостей: отправляет на вход и запоминает, куда человек шёл.
 * Это удобство для пользователя, а настоящая защита данных - проверка токена на сервере.
 */
export default function RequireAuth({ role, children }: RequireAuthProps) {
  const { user, status } = useSession();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress aria-label="Проверяем вход" />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (role && user.role !== role) {
    return (
      <MessageScreen
        title="Нет доступа"
        text="Этот раздел доступен только администратору магазина."
        actionLabel="На главную"
        actionTo="/"
      />
    );
  }

  return <>{children}</>;
}
