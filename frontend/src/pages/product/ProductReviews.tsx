import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Button, Collapse, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { createReview, deleteReview, fetchReviews, Review, ReviewCard, ReviewInput, updateReview } from '@/entities/review';
import { useSession } from '@/entities/session';
import ReviewForm from '@/features/review-form/ReviewForm';
import { useAsyncData } from '@/shared/lib/useAsyncData';
import AsyncContent from '@/shared/ui/AsyncContent';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import EmptyState from '@/shared/ui/EmptyState';
import { useNotify } from '@/shared/ui/notifications';

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, isAdmin } = useSession();
  const location = useLocation();
  const notify = useNotify();
  const { state, reload } = useAsyncData(() => fetchReviews(productId), [productId]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<Review | null>(null);

  // У пользователя может быть только один отзыв на товар (так решено на сервере)
  const hasOwnReview = Boolean(user) && state.status === 'success' && state.data.some((r) => r.userId === user?.id);

  const handleCreate = async (input: ReviewInput) => {
    await createReview(productId, input);
    setFormOpen(false);
    reload();
    notify({ message: 'Спасибо за отзыв!' });
  };

  const handleUpdate = async (id: number, input: ReviewInput) => {
    await updateReview(id, input);
    setEditingId(null);
    reload();
    notify({ message: 'Отзыв изменён' });
  };

  const renderActions = (review: Review) => {
    const isAuthor = review.userId === user?.id;
    if (!isAuthor && !isAdmin) return undefined;
    return (
      <>
        {isAuthor && (
          <Button size="small" onClick={() => setEditingId(review.id)}>
            Изменить
          </Button>
        )}
        <Button size="small" color="error" onClick={() => setToDelete(review)}>
          Удалить
        </Button>
      </>
    );
  };

  return (
    <Box component="section">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h3">Отзывы</Typography>
        {!user && (
          <Button variant="outlined" component={RouterLink} to="/login" state={{ from: location.pathname }}>
            Войдите, чтобы написать отзыв
          </Button>
        )}
        {user && !hasOwnReview && (
          <Button variant="outlined" onClick={() => setFormOpen((open) => !open)}>
            {formOpen ? 'Скрыть форму' : 'Написать отзыв'}
          </Button>
        )}
      </Stack>

      <Collapse in={formOpen && !hasOwnReview} unmountOnExit>
        <Paper sx={{ p: 3, mb: 2 }}>
          <ReviewForm submitLabel="Отправить" onSubmit={handleCreate} onCancel={() => setFormOpen(false)} />
        </Paper>
      </Collapse>

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
            {reviews.map((review) =>
              review.id === editingId ? (
                <Paper key={review.id} sx={{ p: 3 }}>
                  <ReviewForm
                    initial={{ rating: review.rating, text: review.text }}
                    submitLabel="Сохранить"
                    onSubmit={(input) => handleUpdate(review.id, input)}
                    onCancel={() => setEditingId(null)}
                  />
                </Paper>
              ) : (
                <ReviewCard key={review.id} review={review} actions={renderActions(review)} />
              ),
            )}
          </Stack>
        )}
      </AsyncContent>

      <ConfirmDialog
        open={toDelete !== null}
        title="Удалить отзыв?"
        text={toDelete ? `Отзыв пользователя ${toDelete.author} будет удалён без возможности восстановления.` : ''}
        onConfirm={async () => {
          if (!toDelete) return;
          await deleteReview(toDelete.id);
          reload();
          notify({ message: 'Отзыв удалён' });
        }}
        onClose={() => setToDelete(null)}
      />
    </Box>
  );
}
