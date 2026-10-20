import { useMemo, useState } from 'react';
import {
  Box,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Category } from '../types';
import { categoryLabels, products } from '../data/products';
import ProductCard from '../components/ProductCard';

type CategoryFilter = Category | 'all';
type Sort = 'default' | 'asc' | 'desc';

export default function CatalogPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [sort, setSort] = useState<Sort>('default');

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (text === '' || p.name.toLowerCase().includes(text) || p.brand.toLowerCase().includes(text)),
    );
    if (sort === 'asc') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'desc') return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [query, category, sort]);

  return (
    <Stack spacing={3}>
      <Typography variant="h2">Каталог</Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="Поиск по названию или бренду"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="sort-label">Сортировка</InputLabel>
          <Select labelId="sort-label" label="Сортировка" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <MenuItem value="default">По умолчанию</MenuItem>
            <MenuItem value="asc">Сначала дешёвые</MenuItem>
            <MenuItem value="desc">Сначала дорогие</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ overflowX: 'auto', pb: 0.5 }}>
        <ToggleButtonGroup
          exclusive
          color="primary"
          value={category}
          onChange={(_, value: CategoryFilter | null) => value && setCategory(value)}
        >
          <ToggleButton value="all">Все</ToggleButton>
          {(Object.keys(categoryLabels) as Category[]).map((key) => (
            <ToggleButton key={key} value={key}>
              {categoryLabels[key]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {visible.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="h6">Ничего не найдено</Typography>
          <Typography color="text.secondary">Измените запрос или выберите другую категорию.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {visible.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
