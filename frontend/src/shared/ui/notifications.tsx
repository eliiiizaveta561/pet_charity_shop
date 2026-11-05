import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { Button, Snackbar } from '@mui/material';

export interface Notification {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

type Notify = (notification: Notification) => void;

const NotificationContext = createContext<Notify | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [current, setCurrent] = useState<(Notification & { key: number }) | null>(null);
  const [open, setOpen] = useState(false);

  const notify = useCallback<Notify>((notification) => {
    setCurrent({ ...notification, key: Date.now() });
    setOpen(true);
  }, []);

  const handleAction = () => {
    current?.onAction?.();
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <Snackbar
        key={current?.key}
        open={open}
        autoHideDuration={4000}
        onClose={(_, reason) => reason !== 'clickaway' && setOpen(false)}
        message={current?.message}
        action={
          current?.actionLabel && (
            <Button color="secondary" size="small" onClick={handleAction}>
              {current.actionLabel}
            </Button>
          )
        }
      />
    </NotificationContext.Provider>
  );
}

export function useNotify(): Notify {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotify must be used inside NotificationProvider');
  }
  return ctx;
}
