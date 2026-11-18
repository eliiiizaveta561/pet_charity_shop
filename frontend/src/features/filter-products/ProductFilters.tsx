import { Box, FormControl, InputLabel, MenuItem, Select, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SearchField from '@/shared/ui/SearchField';
import { CategoryFilter, ProductFiltersState, Sort } from './useProductFilters';

interface ProductFiltersProps {
  filters: ProductFiltersState;
}

export default function ProductFilters({ filters }: ProductFiltersProps) {
  const { categories, query, setQuery, category, setCategory, sort, setSort } = filters;

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <SearchField label="Поиск по названию или бренду" value={query} onChange={setQuery} />
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
          {categories.map((item) => (
            <ToggleButton key={item.id} value={String(item.id)}>
              {item.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </>
  );
}
