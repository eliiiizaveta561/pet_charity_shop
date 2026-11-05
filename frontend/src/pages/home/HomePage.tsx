import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { fetchProducts, ProductGrid, ProductGridSkeleton } from '@/entities/product';
import AddToCartButton from '@/features/add-to-cart/AddToCartButton';
import { useAsyncData } from '@/shared/lib/useAsyncData';
import AsyncContent from '@/shared/ui/AsyncContent';
import EmptyState from '@/shared/ui/EmptyState';

const steps = [
  { title: 'Выберите товары', text: 'Корм, лежанки и аксессуары для вашего питомца.' },
  { title: 'Найдите организацию', text: 'Откройте карту и выберите приют или фонд рядом с вами.' },
  { title: 'Добавьте пожертвование', text: 'Укажите сумму — она добавится к заказу отдельной строкой.' },
];

export default function HomePage() {
  const { state, reload } = useAsyncData(fetchProducts, []);

  return (
    <Stack spacing={7}>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 4,
          p: { xs: 3, md: 6 },
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h1" sx={{ mb: 2 }}>
              Найдутся все необходимые товары для вашего питомца
            </Typography>
            <Typography sx={{ mb: 3, maxWidth: 520, opacity: 0.92 }}>
              Покупайте товары для животных и добавляйте пожертвование в приют, который вы выбрали на карте.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={RouterLink} to="/catalog" variant="contained" color="secondary" size="large">
                Перейти в каталог
              </Button>
              <Button
                component={RouterLink}
                to="/charities"
                size="large"
                sx={{ color: 'inherit', borderColor: 'rgba(255,255,255,0.6)' }}
                variant="outlined"
              >
                Посмотреть организации
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ fontSize: { xs: 72, md: 120 }, textAlign: 'center', lineHeight: 1.1 }}>😻🐶</Box>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h2" sx={{ mb: 3 }}>
          Как это работает
        </Typography>
        <Grid container spacing={3}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={step.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                    {index + 1}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {step.title}
                  </Typography>
                  <Typography color="text.secondary">{step.text}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 3 }}>
          <Typography variant="h2">Популярные товары</Typography>
          <Button component={RouterLink} to="/catalog">
            Весь каталог
          </Button>
        </Stack>
        <AsyncContent
          state={state}
          onRetry={reload}
          loading={<ProductGridSkeleton count={4} md={3} />}
          isEmpty={(products) => products.length === 0}
          empty={<EmptyState title="Товары скоро появятся" text="Мы готовим витрину, загляните немного позже." />}
        >
          {(products) => (
            <ProductGrid
              products={products.slice(0, 4)}
              md={3}
              renderAction={(product) => <AddToCartButton product={product} />}
            />
          )}
        </AsyncContent>
      </Box>
    </Stack>
  );
}
