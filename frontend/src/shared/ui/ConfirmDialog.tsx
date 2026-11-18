import { useState } from 'react';
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  text: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

/** Подтверждение необратимого действия, например удаления. Ошибку сервера показывает внутри окна. */
export default function ConfirmDialog({ open, title, text, confirmLabel = 'Удалить', onConfirm, onClose }: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось выполнить действие');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} TransitionProps={{ onExited: () => setError(null) }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          Отмена
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleConfirm}
          disabled={busy}
          startIcon={busy ? <CircularProgress size={18} color="inherit" /> : undefined}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
