import { ReactNode } from 'react';
import { Grid } from '@mui/material';
import { Product } from '../model/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  /** Ширина карточки на широком экране из 12 колонок. */
  md?: number;
  renderAction?: (product: Product) => ReactNode;
}

export default function ProductGrid({ products, md = 4, renderAction }: ProductGridProps) {
  return (
    <Grid container spacing={3}>
      {products.map((product, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={md}
          key={product.id}
          className="fade-in-up"
          style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
        >
          <ProductCard product={product} action={renderAction?.(product)} />
        </Grid>
      ))}
    </Grid>
  );
}
