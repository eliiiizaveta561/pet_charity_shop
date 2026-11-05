import { Card, CardContent, Grid, Skeleton, Stack } from '@mui/material';

interface ProductGridSkeletonProps {
  count?: number;
  md?: number;
}

export default function ProductGridSkeleton({ count = 6, md = 4 }: ProductGridSkeletonProps) {
  return (
    <Grid container spacing={3} aria-busy="true" aria-label="Загрузка товаров">
      {Array.from({ length: count }, (_, index) => (
        <Grid item xs={12} sm={6} md={md} key={index}>
          <Card>
            <Skeleton variant="rectangular" height={140} />
            <CardContent>
              <Skeleton width="30%" />
              <Skeleton />
              <Skeleton width="50%" />
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                <Skeleton width="35%" height={32} />
                <Skeleton variant="rounded" width="35%" height={32} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
