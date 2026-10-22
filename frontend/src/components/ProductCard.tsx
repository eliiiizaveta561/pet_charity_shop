import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, Chip, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Product } from '../types';
import { categoryLabels } from '../data/products';
import { formatPrice } from '../utils';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={`/product/${product.id}`} sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            height: 140,
            bgcolor: product.tint,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 64,
          }}
        >
          {product.emoji}
        </Box>
        <CardContent>
          <Chip size="small" label={categoryLabels[product.category]} sx={{ mb: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.brand}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Typography variant="h6">{formatPrice(product.price)}</Typography>
        <Button
          variant="contained"
          size="small"
          color={added ? 'secondary' : 'primary'}
          startIcon={added ? <CheckIcon /> : undefined}
          onClick={handleAdd}
        >
          {added ? 'Добавлено' : 'В корзину'}
        </Button>
      </CardActions>
    </Card>
  );
}
