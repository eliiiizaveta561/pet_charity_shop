import { Link as RouterLink } from 'react-router-dom';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { CartItem, useCart } from '@/entities/cart';
import { ProductImage } from '@/entities/product';
import { formatPrice } from '@/shared/lib/format';
import QuantityStepper from '@/shared/ui/QuantityStepper';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { setQty, removeItem } = useCart();
  const { product, qty } = item;

  return (
    <Paper sx={{ p: 2 }}>
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
        <IconButton aria-label="Удалить товар" onClick={() => removeItem(product.id)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
}
