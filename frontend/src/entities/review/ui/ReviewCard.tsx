import { ReactNode } from 'react';
import { Box, Paper, Rating, Stack, Typography } from '@mui/material';
import { formatDate } from '@/shared/lib/format';
import { Review } from '../model/types';

interface ReviewCardProps {
  review: Review;
  /** Кнопки «Изменить» и «Удалить»: показываются только тем, у кого есть права. */
  actions?: ReactNode;
}

export default function ReviewCard({ review, actions }: ReviewCardProps) {
  return (
    <Paper className="fade-in-up" sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Box>
          <Typography component="span" sx={{ fontWeight: 700, mr: 1 }}>
            {review.author}
          </Typography>
          <Typography component="span" variant="body2" color="text.secondary">
            {formatDate(review.createdAt)}
          </Typography>
        </Box>
        <Rating value={review.rating} readOnly size="small" />
      </Stack>
      <Typography variant="body2">{review.text}</Typography>
      {actions && (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {actions}
        </Stack>
      )}
    </Paper>
  );
}
