import { useState } from 'react';
import { Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { createReview, fetchReviews, NewReview, ReviewCard } from '@/entities/review';
import AddReviewForm from '@/features/add-review/AddReviewForm';
import { useAsyncData } from '@/shared/lib/useAsyncData';
import AsyncContent from '@/shared/ui/AsyncContent';
import EmptyState from '@/shared/ui/EmptyState';
import { useNotify } from '@/shared/ui/notifications';

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const notify = useNotify();
  const { state, reload } = useAsyncData(() => fetchReviews(productId), [productId]);
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = async (review: NewReview) => {
    await createReview(review);
    setFormOpen(false);
    reload();
    notify({ message: 'Спасибо за отзыв!' });
  };

  return (
    <Box component="section">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h3">Отзывы</Typography>
        {!formOpen && (
          <Button variant="outlined" onClick={() => setFormOpen(true)}>
            Написать отзыв
          </Button>
        )}
      </Stack>

      {formOpen && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <AddReviewForm productId={productId} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
        </Paper>
      )}

      <AsyncContent
        state={state}
        onRetry={reload}
        loading={
          <Stack spacing={2} aria-busy="true" aria-label="Загрузка отзывов">
            <Skeleton variant="rounded" height={80} />
            <Skeleton variant="rounded" height={80} />
          </Stack>
        }
        isEmpty={(reviews) => reviews.length === 0}
        empty={<EmptyState title="Отзывов пока нет" text="Купили этот товар? Расскажите о нём первым." />}
      >
        {(reviews) => (
          <Stack spacing={2}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </Stack>
        )}
      </AsyncContent>
    </Box>
  );
}
