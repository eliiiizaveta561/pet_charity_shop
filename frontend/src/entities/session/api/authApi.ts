import { refreshSession, request, setAccessToken } from '@/shared/api/http';
import { LoginData, RegisterData, User } from '../model/types';

/** Ответ /auth/login, /auth/register и /auth/refresh. Refresh token приходит отдельно, в cookie. */
interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export async function login(data: LoginData): Promise<User> {
  const tokens = await request<TokenResponse>('/auth/login', { method: 'POST', body: data });
  setAccessToken(tokens.access_token);
  return tokens.user;
}

export async function register(data: RegisterData): Promise<User> {
  const tokens = await request<TokenResponse>('/auth/register', { method: 'POST', body: data });
  setAccessToken(tokens.access_token);
  return tokens.user;
}

/** После перезагрузки страницы access token потерян, восстанавливаем его по refresh cookie. */
export async function restoreSession(): Promise<User> {
  const tokens = await refreshSession<TokenResponse>();
  return tokens.user;
}

export async function logout(): Promise<void> {
  try {
    // Сервер отзывает refresh token и удаляет cookie
    await request<void>('/auth/logout', { method: 'POST' });
  } finally {
    setAccessToken(null);
  }
}
