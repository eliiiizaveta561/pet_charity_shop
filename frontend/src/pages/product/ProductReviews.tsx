import { useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { NewReview, Review, ReviewCard, reviews as demoReviews } from '@/entities/review';
import AddReviewForm from '@/features/add-review/AddReviewForm';
import EmptyState from '@/shared/ui/EmptyState';
import { useNotify } from '@/shared/ui/notifications';

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const notify = useNotify();
  const [reviews, setReviews] = useState<Review[]>(() => demoReviews.filter((r) => r.productId === productId));
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = (review: NewReview) => {
    setReviews((prev) => [{ ...review, id: Date.now() }, ...prev]);
    setFormOpen(false);
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

      {reviews.length === 0 ? (
        <EmptyState title="Отзывов пока нет" text="Купили этот товар? Расскажите о нём первым." />
      ) : (
        <Stack spacing={2}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
