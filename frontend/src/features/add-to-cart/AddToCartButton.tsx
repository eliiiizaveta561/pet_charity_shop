import { useEffect, useRef, useState } from 'react';
import { Button, ButtonProps, Zoom } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useCart } from '@/entities/cart';
import type { Product } from '@/entities/product';

interface AddToCartButtonProps {
  product: Product;
  qty?: number;
  size?: ButtonProps['size'];
  label?: string;
  onAdded?: () => void;
}

export default function AddToCartButton({ product, qty = 1, size = 'small', label = 'В корзину', onAdded }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    onAdded?.();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button
      variant="contained"
      size={size}
      color={added ? 'secondary' : 'primary'}
      startIcon={
        added ? (
          <Zoom in>
            <CheckIcon />
          </Zoom>
        ) : undefined
      }
      onClick={handleAdd}
    >
      {added ? 'Добавлено' : label}
    </Button>
  );
}
