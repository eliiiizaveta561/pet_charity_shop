import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Collapse, IconButton, Paper, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { CartItem, useCart } from '@/entities/cart';
import { ProductImage } from '@/entities/product';
import { formatPrice } from '@/shared/lib/format';
import { useNotify } from '@/shared/ui/notifications';
import QuantityStepper from '@/shared/ui/QuantityStepper';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { addItem, setQty, removeItem } = useCart();
  const notify = useNotify();
  const { product, qty } = item;
  const [leaving, setLeaving] = useState(false);

  // Товар удаляется из корзины, когда строка уже свернулась.
  const handleExited = () => {
    removeItem(product.id);
    notify({
      message: `«${product.name}» удалён из корзины`,
      actionLabel: 'Вернуть',
      onAction: () => addItem(product, qty),
    });
  };

  return (
    <Collapse in={!leaving} timeout={250} onExited={handleExited}>
      <Paper className="fade-in-up" sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <ProductImage product={product} width={64} height={64} fontSize={32} borderRadius={2} />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              component={RouterLink}
              to={`/product/${product.id}`}
              sx={{ fontWeight: 700, color: 'text.primary', textDecoration: 'none' }}
            >
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatPrice(product.price)} за шт.
            </Typography>
          </Box>
          <QuantityStepper size="small" value={qty} onChange={(next) => setQty(product.id, next)} />
          <Typography sx={{ minWidth: 80, textAlign: 'right', fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
            {formatPrice(product.price * qty)}
          </Typography>
          <IconButton aria-label="Удалить товар" onClick={() => setLeaving(true)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Paper>
    </Collapse>
  );
}
