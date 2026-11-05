import { useParams } from 'react-router-dom';
import { Grid, Skeleton, Stack } from '@mui/material';
import { fetchProduct } from '@/entities/product';
import { useAsyncData } from '@/shared/lib/useAsyncData';
import AsyncContent from '@/shared/ui/AsyncContent';
import MessageScreen from '@/shared/ui/MessageScreen';
import ProductDetails from './ProductDetails';
import ProductReviews from './ProductReviews';

function ProductSkeleton() {
  return (
    <Grid container spacing={4} aria-busy="true" aria-label="Загрузка товара">
      <Grid item xs={12} md={6}>
        <Skeleton variant="rounded" height={380} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton width="25%" />
        <Skeleton height={64} />
        <Skeleton width="40%" />
        <Skeleton sx={{ mt: 2 }} />
        <Skeleton width="80%" />
        <Skeleton width="30%" height={48} sx={{ mt: 2 }} />
        <Skeleton variant="rounded" width="60%" height={44} sx={{ mt: 2 }} />
      </Grid>
    </Grid>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);
  const { state, reload } = useAsyncData(() => fetchProduct(productId), [productId]);

  return (
    <Stack spacing={3}>
      <AsyncContent
        state={state}
        onRetry={reload}
        loading={<ProductSkeleton />}
        isEmpty={(product) => product === null}
        empty={
          <MessageScreen
            title="Товар не найден"
            text="Возможно, ссылка устарела. Вернитесь в каталог и выберите товар заново."
            actionLabel="В каталог"
            actionTo="/catalog"
          />
        }
      >
        {(product) =>
          product && (
            <>
              <ProductDetails product={product} />
              <ProductReviews productId={product.id} />
            </>
          )
        }
      </AsyncContent>
    </Stack>
  );
}
