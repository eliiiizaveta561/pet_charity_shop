import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardActions, CardContent, Chip, Typography } from '@mui/material';
import { formatPrice } from '@/shared/lib/format';
import { categoryLabels, Product } from '../model/types';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
  /** Действие с товаром: сущность не знает про фичи, кнопку передаёт страница. */
  action?: ReactNode;
}

export default function ProductCard({ product, action }: ProductCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={`/product/${product.id}`} sx={{ flexGrow: 1 }}>
        <ProductImage product={product} height={140} fontSize={64} />
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
        {action}
      </CardActions>
    </Card>
  );
}
