import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { fetchCharities } from '@/entities/charity';
import CharityPicker from '@/features/select-charity/CharityPicker';
import { useAsyncData } from '@/shared/lib/useAsyncData';
import AsyncContent from '@/shared/ui/AsyncContent';
import EmptyState from '@/shared/ui/EmptyState';

function CharitiesSkeleton() {
  return (
    <Grid container spacing={3} aria-busy="true" aria-label="Загрузка организаций">
      <Grid item xs={12} md={5}>
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={150} />
          <Skeleton variant="rounded" height={150} />
          <Skeleton variant="rounded" height={150} />
        </Stack>
      </Grid>
      <Grid item xs={12} md={7}>
        <Skeleton variant="rounded" sx={{ height: { xs: 340, md: 560 } }} />
      </Grid>
    </Grid>
  );
}

export default function CharitiesPage() {
  const { state, reload } = useAsyncData(fetchCharities, []);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h2">Организации на карте</Typography>
        <Typography color="text.secondary">
          Нажмите на отметку на карте или на карточку в списке, чтобы выбрать, кому пойдёт ваше пожертвование.
        </Typography>
      </Box>
      <AsyncContent
        state={state}
        onRetry={reload}
        loading={<CharitiesSkeleton />}
        isEmpty={(charities) => charities.length === 0}
        empty={<EmptyState title="Организаций пока нет" text="Мы подключаем приюты и фонды. Загляните позже." />}
      >
        {(charities) => <CharityPicker charities={charities} />}
      </AsyncContent>
    </Stack>
  );
}
