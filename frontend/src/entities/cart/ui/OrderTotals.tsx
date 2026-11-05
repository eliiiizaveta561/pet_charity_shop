import { Stack, Typography } from '@mui/material';
import { formatPrice } from '@/shared/lib/format';

interface OrderTotalsProps {
  itemsTotal: number;
  donation: number;
  total: number;
}

export default function OrderTotals({ itemsTotal, donation, total }: OrderTotalsProps) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between">
        <Typography color="text.secondary">Товары</Typography>
        <Typography>{formatPrice(itemsTotal)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography color="text.secondary">Пожертвование</Typography>
        <Typography>{formatPrice(donation)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Итого</Typography>
        <Typography variant="h6">{formatPrice(total)}</Typography>
      </Stack>
    </Stack>
  );
}
