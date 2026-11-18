import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { CartProvider } from '@/entities/cart';
import { SessionProvider } from '@/entities/session';
import { NotificationProvider } from '@/shared/ui/notifications';
import theme from '../theme';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NotificationProvider>
          <SessionProvider>
            <CartProvider>{children}</CartProvider>
          </SessionProvider>
        </NotificationProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
