import { useLocation } from 'react-router-dom';

/** Куда вернуть пользователя после входа. Адрес передаёт RequireAuth или кнопка «Войдите». */
export function useReturnPath(): string {
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  // Только внутренние адреса: ссылка не должна уводить на чужой сайт
  return from && from.startsWith('/') && !from.startsWith('//') ? from : '/';
}
