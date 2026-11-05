import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useCart } from '@/entities/cart';
import { Charity, CharityCard, CharityMap } from '@/entities/charity';
import SearchField from '@/shared/ui/SearchField';

interface CharityPickerProps {
  charities: Charity[];
}

export default function CharityPicker({ charities }: CharityPickerProps) {
  const { charity: selected, setCharity, count } = useCart();
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return charities;
    return charities.filter((c) => c.name.toLowerCase().includes(text) || c.city.toLowerCase().includes(text));
  }, [charities, query]);

  return (
    <Stack spacing={3}>
      {selected && (
        <Alert
          severity="success"
          action={
            <>
              <Button color="inherit" size="small" onClick={() => setCharity(null)}>
                Снять выбор
              </Button>
              <Button color="inherit" size="small" component={RouterLink} to={count > 0 ? '/cart' : '/catalog'}>
                {count > 0 ? 'Вернуться в корзину' : 'Выбрать товары'}
              </Button>
            </>
          }
        >
          Выбрано: {selected.name}, {selected.city}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={5} sx={{ order: { xs: 2, md: 1 } }}>
          <Stack spacing={2}>
            <SearchField size="small" label="Название или город" value={query} onChange={setQuery} />
            {visible.length === 0 && (
              <Typography color="text.secondary">Организации не найдены. Попробуйте другое название или город.</Typography>
            )}
            {visible.map((charity) => (
              <CharityCard key={charity.id} charity={charity} active={charity.id === selected?.id} onSelect={setCharity} />
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={7} sx={{ order: { xs: 1, md: 2 } }}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
            <CharityMap
              charities={visible}
              selectedId={selected?.id ?? null}
              onSelect={setCharity}
              height={{ xs: 340, md: 560 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}
