import { useSyncExternalStore } from 'react';
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { DemoMode, getDemoMode, setDemoMode, subscribeDemoMode } from '@/shared/api/demo';

const modes: { value: DemoMode; label: string }[] = [
  { value: 'normal', label: 'Обычно' },
  { value: 'slow', label: 'Долгая загрузка' },
  { value: 'error', label: 'Ошибка' },
  { value: 'empty', label: 'Нет данных' },
];

/** Переключатель поведения демонстрационного сервера. Есть только в режиме разработки. */
export default function DemoModeSwitch() {
  const mode = useSyncExternalStore(subscribeDemoMode, getDemoMode);

  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 1.5, px: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center" justifyContent="center">
        <Typography variant="body2" color="text.secondary">
          Демо-данные:
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          color="primary"
          value={mode}
          onChange={(_, value: DemoMode | null) => value && setDemoMode(value)}
          sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {modes.map((item) => (
            <ToggleButton key={item.value} value={item.value}>
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Box>
  );
}
