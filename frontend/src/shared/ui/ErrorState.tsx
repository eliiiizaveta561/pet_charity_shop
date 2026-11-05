import { Alert, AlertTitle, Button } from '@mui/material';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      className="fade-in-up"
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Повторить
        </Button>
      }
    >
      <AlertTitle>Не удалось загрузить данные</AlertTitle>
      {message}
    </Alert>
  );
}
