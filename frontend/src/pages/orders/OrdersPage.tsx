import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { fetchOrders, OrderCard } from '@/entities/order';
import { useSession } from '@/entities/session';
import OrderActions from '@/features/manage-order/OrderActions';
import { useAsyncData } from '@/shared/lib/useAsyncData';
import AsyncContent from '@/shared/ui/AsyncContent';
import EmptyState from '@/shared/ui/EmptyState';

export default function OrdersPage() {
  const { isAdmin } = useSession();
  const { state, reload } = useAsyncData(fetchOrders, []);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h2">{isAdmin ? 'Все заказы' : 'Мои заказы'}</Typography>
        {isAdmin && (
          <Typography color="text.secondary">Администратор видит заказы всех покупателей и меняет их статус.</Typography>
        )}
      </Box>
      <AsyncContent
        state={state}
        onRetry={reload}
        loading={
          <Stack spacing={2} aria-busy="true" aria-label="Загрузка заказов">
            <Skeleton variant="rounded" height={180} />
            <Skeleton variant="rounded" height={180} />
          </Stack>
        }
        isEmpty={(orders) => orders.length === 0}
        empty={
          <EmptyState
            title="Заказов пока нет"
            text="Оформленные заказы появятся здесь."
            action={
              <Button component={RouterLink} to="/catalog" variant="contained">
                Перейти в каталог
              </Button>
            }
          />
        }
      >
        {(orders) => (
          <Stack spacing={2}>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actions={<OrderActions order={order} isAdmin={isAdmin} onChanged={reload} />}
              />
            ))}
          </Stack>
        )}
      </AsyncContent>
    </Stack>
  );
}
