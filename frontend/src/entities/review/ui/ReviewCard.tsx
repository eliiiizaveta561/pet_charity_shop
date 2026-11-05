import { Paper, Rating, Stack, Typography } from '@mui/material';
import { Review } from '../model/types';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography sx={{ fontWeight: 700 }}>{review.author}</Typography>
        <Rating value={review.rating} readOnly size="small" />
      </Stack>
      <Typography variant="body2">{review.text}</Typography>
    </Paper>
  );
}
