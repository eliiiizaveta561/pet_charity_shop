import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import { Category, createProduct, Product, updateProduct } from '@/entities/product';
import { useForm } from '@/shared/lib/useForm';
import { FormRules, matches, maxLength, minLength, required } from '@/shared/lib/validation';

interface ProductValues {
  name: string;
  brand: string;
  categoryId: string;
  price: string;
  emoji: string;
  description: string;
}

const rules: FormRules<ProductValues> = {
  name: [required('Введите название'), minLength(2, 'Название должно содержать не меньше 2 символов'), maxLength(200, 'Слишком длинное название')],
  brand: [required('Введите бренд'), maxLength(100, 'Слишком длинное название бренда')],
  categoryId: [required('Выберите категорию')],
  price: [
    required('Укажите цену'),
    matches(/^\d+$/, 'Цена - целое число рублей'),
    (value) => (Number(value) < 1 || Number(value) > 10_000_000 ? 'Цена от 1 до 10 000 000 ₽' : null),
  ],
  emoji: [required('Добавьте эмодзи для карточки'), maxLength(16, 'Не больше нескольких символов')],
  description: [maxLength(2000, 'Описание не длиннее 2000 символов')],
};

const toValues = (product: Product | null): ProductValues => ({
  name: product?.name ?? '',
  brand: product?.brand ?? '',
  categoryId: product ? String(product.category.id) : '',
  price: product ? String(product.price) : '',
  emoji: product?.emoji ?? '🐾',
  description: product?.description ?? '',
});

interface ProductFormDialogProps {
  /** null - новый товар, иначе редактируемый. */
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (product: Product) => void;
}

export default function ProductFormDialog({ product, categories, onClose, onSaved }: ProductFormDialogProps) {
  const form = useForm<ProductValues>({
    initialValues: toValues(product),
    rules,
    serverFields: { category_id: 'categoryId' },
    onSubmit: async (values) => {
      const input = {
        name: values.name.trim(),
        brand: values.brand.trim(),
        categoryId: Number(values.categoryId),
        price: Number(values.price),
        emoji: values.emoji.trim(),
        description: values.description.trim(),
      };
      const saved = product ? await updateProduct(product.id, input) : await createProduct(input);
      onSaved(saved);
    },
  });

  return (
    <Dialog open onClose={form.submitting ? undefined : onClose} fullWidth maxWidth="sm">
      <form onSubmit={form.handleSubmit} noValidate>
        <DialogTitle>{product ? 'Изменить товар' : 'Новый товар'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField label="Название" required fullWidth {...form.field('name')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Бренд" required fullWidth {...form.field('brand')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Категория" select required fullWidth {...form.field('categoryId')}>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={8}>
              <TextField label="Цена, ₽" required fullWidth inputProps={{ inputMode: 'numeric' }} {...form.field('price')} />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Эмодзи" required fullWidth {...form.field('emoji')} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Описание" multiline minRows={3} fullWidth {...form.field('description')} />
            </Grid>
          </Grid>
          {form.submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {form.submitError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={form.submitting}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={form.submitting}
            startIcon={form.submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
