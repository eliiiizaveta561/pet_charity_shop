import { Box, Stack, Typography } from '@mui/material';
import { charities } from '@/entities/charity';
import CharityPicker from '@/features/select-charity/CharityPicker';

export default function CharitiesPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h2">Организации на карте</Typography>
        <Typography color="text.secondary">
          Нажмите на отметку на карте или на карточку в списке, чтобы выбрать, кому пойдёт ваше пожертвование.
        </Typography>
      </Box>
      <CharityPicker charities={charities} />
    </Stack>
  );
}
