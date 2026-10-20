import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { charities } from '../data/charities';
import { useCart } from '../context/CartContext';
import CharityMap from '../components/CharityMap';

export default function CharitiesPage() {
  const { charityId, setCharityId, count } = useCart();
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return charities;
    return charities.filter((c) => c.name.toLowerCase().includes(text) || c.city.toLowerCase().includes(text));
  }, [query]);

  const selected = charities.find((c) => c.id === charityId);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h2">Организации на карте</Typography>
        <Typography color="text.secondary">
          Нажмите на отметку на карте или на карточку в списке, чтобы выбрать, кому пойдёт ваше пожертвование.
        </Typography>
      </Box>

      {selected && (
        <Alert
          severity="success"
          action={
            <Button color="inherit" size="small" component={RouterLink} to={count > 0 ? '/cart' : '/catalog'}>
              {count > 0 ? 'Вернуться в корзину' : 'Выбрать товары'}
            </Button>
          }
        >
          Выбрано: {selected.name}, {selected.city}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={5} sx={{ order: { xs: 2, md: 1 } }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="Название или город"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            {visible.length === 0 && (
              <Typography color="text.secondary">Организации не найдены. Попробуйте другое название или город.</Typography>
            )}
            {visible.map((charity) => {
              const active = charity.id === charityId;
              return (
                <Card
                  key={charity.id}
                  sx={{ borderColor: active ? 'primary.main' : 'divider', borderWidth: active ? 2 : 1 }}
                >
                  <CardActionArea onClick={() => setCharityId(charity.id)}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {charity.name}
                        </Typography>
                        {active && <CheckCircleIcon color="primary" />}
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {charity.city}, {charity.address}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {charity.description}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
                        Нужно: {charity.need}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
          </Stack>
        </Grid>

        <Grid item xs={12} md={7} sx={{ order: { xs: 1, md: 2 } }}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
            <CharityMap
              charities={visible}
              selectedId={charityId}
              onSelect={setCharityId}
              height={{ xs: 340, md: 560 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}
