import { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  title: string;
  text: string;
  action?: ReactNode;
}

export default function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: action ? 2 : 0 }}>
        {text}
      </Typography>
      {action}
    </Box>
  );
}
