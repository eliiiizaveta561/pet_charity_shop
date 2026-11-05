import { Alert, Box, Button, CircularProgress, FormHelperText, Rating, Stack, TextField, Typography } from '@mui/material';
import type { NewReview } from '@/entities/review';
import { useForm } from '@/shared/lib/useForm';
import { FormRules, maxLength, minLength, required } from '@/shared/lib/validation';

interface ReviewValues {
  author: string;
  rating: string;
  text: string;
}

const rules: FormRules<ReviewValues> = {
  author: [required('Введите имя'), minLength(2, 'Имя должно содержать не меньше 2 символов')],
  rating: [required('Поставьте оценку')],
  text: [
    required('Напишите отзыв'),
    minLength(10, 'Отзыв должен содержать не меньше 10 символов'),
    maxLength(500, 'Отзыв должен содержать не больше 500 символов'),
  ],
};

interface AddReviewFormProps {
  productId: number;
  onSubmit: (review: NewReview) => void | Promise<void>;
  onCancel: () => void;
}

export default function AddReviewForm({ productId, onSubmit, onCancel }: AddReviewFormProps) {
  const form = useForm<ReviewValues>({
    initialValues: { author: '', rating: '', text: '' },
    rules,
    onSubmit: ({ author, rating, text }) =>
      onSubmit({ productId, author: author.trim(), rating: Number(rating), text: text.trim() }),
  });
  const ratingError = form.errorOf('rating');

  return (
    <Box component="form" onSubmit={form.handleSubmit} noValidate>
      <Stack spacing={2}>
        <TextField label="Ваше имя" required fullWidth {...form.field('author')} />
        <Box>
          <Typography component="legend" variant="body2" sx={{ mb: 0.5 }}>
            Оценка
          </Typography>
          <Rating
            name="rating"
            value={form.values.rating === '' ? null : Number(form.values.rating)}
            onChange={(_, value) => form.setValue('rating', value === null ? '' : String(value))}
          />
          {ratingError && <FormHelperText error>{ratingError}</FormHelperText>}
        </Box>
        <TextField label="Отзыв" required multiline minRows={3} fullWidth {...form.field('text')} />
        {form.submitError && <Alert severity="error">{form.submitError}</Alert>}
        <Stack direction="row" spacing={1}>
          <Button
            type="submit"
            variant="contained"
            disabled={form.submitting}
            startIcon={form.submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            Отправить
          </Button>
          <Button onClick={onCancel}>Отмена</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
