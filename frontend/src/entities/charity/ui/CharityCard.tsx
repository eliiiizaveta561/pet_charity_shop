import { Card, CardActionArea, CardContent, Stack, Typography, Zoom } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Charity } from '../model/types';

interface CharityCardProps {
  charity: Charity;
  active: boolean;
  onSelect: (charity: Charity) => void;
}

export default function CharityCard({ charity, active, onSelect }: CharityCardProps) {
  return (
    <Card
      className="fade-in-up"
      sx={{
        borderColor: active ? 'primary.main' : 'divider',
        borderWidth: active ? 2 : 1,
        transition: 'border-color 0.2s',
      }}
    >
      <CardActionArea onClick={() => onSelect(charity)}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {charity.name}
            </Typography>
            <Zoom in={active} unmountOnExit>
              <CheckCircleIcon color="primary" />
            </Zoom>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {charity.city}, {charity.address}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {charity.description}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
            Нужно: {charity.need}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
