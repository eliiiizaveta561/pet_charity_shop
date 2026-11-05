import { IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  size?: 'small' | 'medium';
}

export default function QuantityStepper({ value, onChange, min = 1, size = 'medium' }: QuantityStepperProps) {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size={size} aria-label="Уменьшить количество" disabled={value <= min} onClick={() => onChange(value - 1)}>
        <RemoveIcon />
      </IconButton>
      <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 700 }}>{value}</Typography>
      <IconButton size={size} aria-label="Увеличить количество" onClick={() => onChange(value + 1)}>
        <AddIcon />
      </IconButton>
    </Stack>
  );
}
