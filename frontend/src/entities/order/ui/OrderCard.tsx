import { ReactNode } from 'react';
import { Box, Chip, ChipProps, Divider, Paper, Stack, Typography } from '@mui/material';
import { formatDate, formatPrice } from '@/shared/lib/format';
import { Order, OrderStatus, orderStatusLabels } from '../model/types';

const statusColors: Record<OrderStatus, ChipProps['color']> = {
  new: 'info',
  paid: 'primary',
  shipped: 'success',
  cancelled: 'default',
};

interface OrderCardProps {
  order: Order;
  /** Кнопки управления заказом: зависят от прав, поэтому их передаёт страница. */
  actions?: ReactNode;
}

export default function OrderCard({ order, actions }: OrderCardProps) {
  return (
    <Paper className="fade-in-up" sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 1 }}>
        <Box>
          <Typography variant="h6">Заказ №{order.id}</Typography>
          <Typography variant="body2" color="text.secondary">
            от {formatDate(order.createdAt)}
          </Typography>
        </Box>
        <Chip label={orderStatusLabels[order.status]} color={statusColors[order.status]} />
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {order.customer.name}, {order.customer.phone}, {order.customer.address}
      </Typography>

      <Stack spacing={0.5}>
        {order.items.map((item) => (
          <Stack key={item.productId} direction="row" justifyContent="space-between" spacing={2}>
            <Typography variant="body2">
              {item.productName} × {item.quantity}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
              {formatPrice(item.unitPrice * item.quantity)}
            </Typography>
          </Stack>
        ))}
        {order.donation && (
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Typography variant="body2" color="primary">
              Пожертвование: {order.donation.charityName}
            </Typography>
            <Typography variant="body2" color="primary" sx={{ whiteSpace: 'nowrap' }}>
              {formatPrice(order.donation.amount)}
            </Typography>
          </Stack>
        )}
      </Stack>

      <Divider sx={{ my: 1.5 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1}>
        <Typography sx={{ fontWeight: 700 }}>Итого: {formatPrice(order.total)}</Typography>
        {actions}
      </Stack>
    </Paper>
  );
}
