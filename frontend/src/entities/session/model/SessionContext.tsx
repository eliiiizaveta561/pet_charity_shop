import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { setSessionExpiredHandler } from '@/shared/api/http';
import * as authApi from '../api/authApi';
import { LoginData, RegisterData, User } from './types';

type SessionStatus = 'loading' | 'guest' | 'authenticated';

interface SessionState {
  user: User | null;
  /** loading - пока проверяем, есть ли сохранённая сессия. */
  status: SessionStatus;
  isAdmin: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<SessionStatus>('loading');

  const signIn = (next: User) => {
    setUser(next);
    setStatus('authenticated');
  };

  const signOut = () => {
    setUser(null);
    setStatus('guest');
  };

  useEffect(() => {
    setSessionExpiredHandler(signOut);
    authApi.restoreSession().then(signIn, signOut);
    return () => setSessionExpiredHandler(null);
  }, []);

  const value = useMemo<SessionState>(
    () => ({
      user,
      status,
      isAdmin: user?.role === 'admin',
      login: async (data) => signIn(await authApi.login(data)),
      register: async (data) => signIn(await authApi.register(data)),
      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          // Даже если сервер не ответил, на клиенте пользователь выходит
          signOut();
        }
      },
    }),
    [user, status],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used inside SessionProvider');
  }
  return ctx;
}
