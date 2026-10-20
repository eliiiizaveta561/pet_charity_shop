import { Link as RouterLink } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h2">Страница не найдена</Typography>
      <Typography color="text.secondary">Проверьте адрес или вернитесь на главную.</Typography>
      <Button component={RouterLink} to="/" variant="contained">
        На главную
      </Button>
    </Stack>
  );
}
