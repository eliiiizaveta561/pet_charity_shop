import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import { useCart } from '@/entities/cart';

const presets = [0, 50, 100, 200];

export default function DonationPanel() {
  const { charity, donation, setDonation } = useCart();

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <VolunteerActivismIcon color="primary" />
        <Typography variant="h6">Пожертвование</Typography>
      </Stack>

      {charity ? (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 700 }}>{charity.name}</Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
            <PlaceIcon fontSize="small" />
            <Typography variant="body2">
              {charity.city}, {charity.address}
            </Typography>
          </Stack>
          <Button component={RouterLink} to="/charities" size="small" sx={{ mt: 0.5, px: 0 }}>
            Изменить на карте
          </Button>
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Организация не выбрана. Выберите её на карте, чтобы добавить пожертвование.
          </Typography>
          <Button component={RouterLink} to="/charities" variant="outlined" size="small" startIcon={<PlaceIcon />}>
            Выбрать на карте
          </Button>
        </Box>
      )}

      <Typography variant="body2" sx={{ mb: 1 }}>
        Сумма пожертвования
      </Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        value={presets.includes(donation) ? donation : null}
        onChange={(_, value: number | null) => value !== null && setDonation(value)}
        sx={{ flexWrap: 'wrap', mb: 1.5 }}
      >
        {presets.map((amount) => (
          <ToggleButton key={amount} value={amount}>
            {amount === 0 ? 'Без пожертвования' : `${amount} ₽`}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <TextField
        size="small"
        fullWidth
        type="number"
        label="Своя сумма, ₽"
        value={donation === 0 ? '' : donation}
        onChange={(e) => setDonation(Number(e.target.value))}
        inputProps={{ min: 0, step: 10 }}
      />

      {donation > 0 && !charity && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Выберите организацию на карте или уберите сумму пожертвования.
        </Alert>
      )}
    </Box>
  );
}
