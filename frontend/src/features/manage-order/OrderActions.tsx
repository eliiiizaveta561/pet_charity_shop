import { useState } from 'react';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { deleteOrder, Order, OrderStatus, orderStatuses, orderStatusLabels, updateOrderStatus } from '@/entities/order';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import { useNotify } from '@/shared/ui/notifications';

interface OrderActionsProps {
  order: Order;
  isAdmin: boolean;
  /** Вызывается после изменения, чтобы страница перезагрузила список. */
  onChanged: () => void;
}

/**
 * Покупатель может отменить новый заказ. Администратор меняет статус любого заказа и может его удалить.
 * Те же правила проверяет сервер, здесь мы только не показываем недоступные кнопки.
 */
export default function OrderActions({ order, isAdmin, onChanged }: OrderActionsProps) {
  const notify = useNotify();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<'cancel' | 'delete' | null>(null);

  const changeStatus = async (status: OrderStatus) => {
    setBusy(true);
    try {
      await updateOrderStatus(order.id, status);
      notify({ message: `Заказ №${order.id}: ${orderStatusLabels[status].toLowerCase()}` });
      onChanged();
    } catch (error) {
      notify({ message: error instanceof Error ? error.message : 'Не удалось изменить заказ' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {isAdmin ? (
        <>
          <TextField
            select
            size="small"
            label="Статус"
            value={order.status}
            disabled={busy}
            onChange={(e) => changeStatus(e.target.value as OrderStatus)}
            sx={{ minWidth: 150 }}
          >
            {orderStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {orderStatusLabels[status]}
              </MenuItem>
            ))}
          </TextField>
          <Button color="error" disabled={busy} onClick={() => setConfirm('delete')}>
            Удалить
          </Button>
        </>
      ) : (
        order.status === 'new' && (
          <Button color="error" variant="outlined" disabled={busy} onClick={() => setConfirm('cancel')}>
            Отменить заказ
          </Button>
        )
      )}

      <ConfirmDialog
        open={confirm === 'cancel'}
        title={`Отменить заказ №${order.id}?`}
        text="Заказ получит статус «Отменён». Вернуть его будет нельзя."
        confirmLabel="Отменить заказ"
        onConfirm={async () => {
          await updateOrderStatus(order.id, 'cancelled');
          notify({ message: `Заказ №${order.id} отменён` });
          onChanged();
        }}
        onClose={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'delete'}
        title={`Удалить заказ №${order.id}?`}
        text="Заказ, его позиции и пожертвование будут удалены из базы."
        onConfirm={async () => {
          await deleteOrder(order.id);
          notify({ message: `Заказ №${order.id} удалён` });
          onChanged();
        }}
        onClose={() => setConfirm(null)}
      />
    </Stack>
  );
}
