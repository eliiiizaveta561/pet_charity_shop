import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/EditOutlined';
import { deleteProduct, fetchCategories, fetchProducts, Product, ProductImage } from '@/entities/product';
import ProductFormDialog from '@/features/manage-products/ProductFormDialog';
import { formatPrice } from '@/shared/lib/format';
import { useAsyncData } from '@/shared/lib/useAsyncData';
import AsyncContent from '@/shared/ui/AsyncContent';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import EmptyState from '@/shared/ui/EmptyState';
import { useNotify } from '@/shared/ui/notifications';

const loadCatalog = () => Promise.all([fetchProducts(), fetchCategories()]);

export default function AdminProductsPage() {
  const notify = useNotify();
  const { state, reload } = useAsyncData(loadCatalog, []);
  // undefined - окно закрыто, null - новый товар, Product - редактирование
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const handleSaved = (product: Product) => {
    notify({ message: editing ? `Товар «${product.name}» сохранён` : `Товар «${product.name}» добавлен` });
    setEditing(undefined);
    reload();
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h2">Управление товарами</Typography>
          <Typography color="text.secondary">Изменения сразу видны в каталоге.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditing(null)} disabled={state.status !== 'success'}>
          Добавить товар
        </Button>
      </Stack>

      <AsyncContent
        state={state}
        onRetry={reload}
        loading={<Skeleton variant="rounded" height={400} />}
        isEmpty={([products]) => products.length === 0}
        empty={<EmptyState title="Товаров нет" text="Добавьте первый товар кнопкой выше." />}
      >
        {([products]) => (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 640 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Товар</TableCell>
                  <TableCell>Категория</TableCell>
                  <TableCell align="right">Цена</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <ProductImage product={product} width={44} height={44} fontSize={24} borderRadius={2} />
                        <Box>
                          <Typography
                            component={RouterLink}
                            to={`/product/${product.id}`}
                            sx={{ fontWeight: 700, color: 'text.primary', textDecoration: 'none' }}
                          >
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.brand}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title="Изменить">
                        <IconButton aria-label={`Изменить «${product.name}»`} onClick={() => setEditing(product)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton aria-label={`Удалить «${product.name}»`} color="error" onClick={() => setToDelete(product)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AsyncContent>

      {editing !== undefined && state.status === 'success' && (
        <ProductFormDialog
          product={editing}
          categories={state.data[1]}
          onClose={() => setEditing(undefined)}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Удалить товар?"
        text={toDelete ? `«${toDelete.name}» исчезнет из каталога. Товар из оформленных заказов удалить нельзя.` : ''}
        onConfirm={async () => {
          if (!toDelete) return;
          await deleteProduct(toDelete.id);
          notify({ message: `Товар «${toDelete.name}» удалён` });
          reload();
        }}
        onClose={() => setToDelete(null)}
      />
    </Stack>
  );
}
