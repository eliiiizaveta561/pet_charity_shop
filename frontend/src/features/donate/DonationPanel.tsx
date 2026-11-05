import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Collapse, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import { useCart } from '@/entities/cart';
import { matches, validate } from '@/shared/lib/validation';

const presets = [0, 50, 100, 200];
const MAX_DONATION = 100_000;

const amountRules = {
  amount: [
    matches(/^\d*$/, 'Введите целое число рублей'),
    (value: string) => (Number(value) > MAX_DONATION ? 'Сумма не может быть больше 100 000 ₽' : null),
  ],
};

interface DonationPanelProps {
  /** Сообщает странице, что в поле суммы сейчас ошибка. */
  onValidityChange?: (valid: boolean) => void;
}

export default function DonationPanel({ onValidityChange }: DonationPanelProps) {
  const { charity, donation, setDonation } = useCart();
  // Текст поля хранится отдельно: неверное значение показываем, но в корзину не записываем.
  const [draft, setDraft] = useState<string | null>(null);

  const amountError = draft === null ? undefined : validate({ amount: draft }, amountRules).amount;

  useEffect(() => {
    onValidityChange?.(!amountError);
  }, [amountError, onValidityChange]);

  const handleAmountChange = (value: string) => {
    setDraft(value);
    if (!validate({ amount: value }, amountRules).amount) {
      setDonation(Number(value));
    }
  };

  const handlePreset = (amount: number) => {
    setDraft(null);
    setDonation(amount);
  };

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
        value={presets.includes(donation) && !amountError ? donation : null}
        onChange={(_, value: number | null) => value !== null && handlePreset(value)}
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
        label="Своя сумма, ₽"
        value={draft ?? (donation === 0 ? '' : String(donation))}
        onChange={(e) => handleAmountChange(e.target.value)}
        error={Boolean(amountError)}
        helperText={amountError}
        inputProps={{ inputMode: 'numeric' }}
      />

      <Collapse in={donation > 0 && !charity} unmountOnExit>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Выберите организацию на карте или уберите сумму пожертвования.
        </Alert>
      </Collapse>
    </Box>
  );
}
