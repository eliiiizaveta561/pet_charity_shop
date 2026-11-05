import { FormEvent, useState } from 'react';
import { Box, Button, Rating, Stack, TextField, Typography } from '@mui/material';
import type { NewReview } from '@/entities/review';

interface AddReviewFormProps {
  productId: number;
  onSubmit: (review: NewReview) => void;
  onCancel: () => void;
}

export default function AddReviewForm({ productId, onSubmit, onCancel }: AddReviewFormProps) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState<number | null>(5);
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ productId, author: author.trim(), rating: rating ?? 0, text: text.trim() });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        <TextField label="Ваше имя" value={author} onChange={(e) => setAuthor(e.target.value)} fullWidth />
        <Box>
          <Typography component="legend" variant="body2" sx={{ mb: 0.5 }}>
            Оценка
          </Typography>
          <Rating value={rating} onChange={(_, value) => setRating(value)} />
        </Box>
        <TextField label="Отзыв" value={text} onChange={(e) => setText(e.target.value)} multiline minRows={3} fullWidth />
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained">
            Отправить
          </Button>
          <Button onClick={onCancel}>Отмена</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
