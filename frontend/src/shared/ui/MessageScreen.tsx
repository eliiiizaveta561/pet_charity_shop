import { Link as RouterLink } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';

interface MessageScreenProps {
  title: string;
  text: string;
  actionLabel: string;
  actionTo: string;
}

/** Экран-сообщение: пустая корзина, товар не найден, ошибка адреса. */
export default function MessageScreen({ title, text, actionLabel, actionTo }: MessageScreenProps) {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h2">{title}</Typography>
      <Typography color="text.secondary">{text}</Typography>
      <Button component={RouterLink} to={actionTo} variant="contained">
        {actionLabel}
      </Button>
    </Stack>
  );
}
