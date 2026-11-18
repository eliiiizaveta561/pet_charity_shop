import { Alert, Box, Button, CircularProgress, FormHelperText, Rating, Stack, TextField, Typography } from '@mui/material';
import type { ReviewInput } from '@/entities/review';
import { useForm } from '@/shared/lib/useForm';
import { FormRules, maxLength, minLength, required } from '@/shared/lib/validation';

interface ReviewValues {
  rating: string;
  text: string;
}

const rules: FormRules<ReviewValues> = {
  rating: [required('Поставьте оценку')],
  text: [
    required('Напишите отзыв'),
    minLength(10, 'Отзыв должен содержать не меньше 10 символов'),
    maxLength(500, 'Отзыв должен содержать не больше 500 символов'),
  ],
};

interface ReviewFormProps {
  /** Для редактирования: текущая оценка и текст. */
  initial?: ReviewInput;
  submitLabel: string;
  onSubmit: (review: ReviewInput) => Promise<void>;
  onCancel: () => void;
}

/** Форма отзыва для создания и редактирования. Имя автора берётся из аккаунта. */
export default function ReviewForm({ initial, submitLabel, onSubmit, onCancel }: ReviewFormProps) {
  const form = useForm<ReviewValues>({
    initialValues: { rating: initial ? String(initial.rating) : '', text: initial?.text ?? '' },
    rules,
    onSubmit: ({ rating, text }) => onSubmit({ rating: Number(rating), text: text.trim() }),
  });
  const ratingError = form.errorOf('rating');

  return (
    <Box component="form" onSubmit={form.handleSubmit} noValidate>
      <Stack spacing={2}>
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
            {submitLabel}
          </Button>
          <Button onClick={onCancel}>Отмена</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
