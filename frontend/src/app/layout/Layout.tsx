import { useState } from 'react';
import { Link as RouterLink, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import PetsIcon from '@mui/icons-material/Pets';
import { useCart } from '@/entities/cart';
import DemoModeSwitch from './DemoModeSwitch';

const navItems = [
  { to: '/', label: 'Главная', end: true },
  { to: '/catalog', label: 'Каталог', end: false },
  { to: '/charities', label: 'Организации на карте', end: false },
];

export default function Layout() {
  const { count } = useCart();
  const { pathname } = useLocation();
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'));
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'inherit', textDecoration: 'none', mr: 2 }}
          >
            <PetsIcon />
            <Typography variant="h6" component="span">
              Добромаркет
            </Typography>
          </Box>

          {!compact && (
            <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  end={item.end}
                  color="inherit"
                  sx={{ '&.active': { bgcolor: 'rgba(255,255,255,0.18)' } }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
          {compact && <Box sx={{ flexGrow: 1 }} />}

          <IconButton component={RouterLink} to="/cart" color="inherit" aria-label="Корзина">
            {/* Смена key перезапускает анимацию при каждом изменении количества. */}
            <Badge key={count} className={count > 0 ? 'pop' : undefined} badgeContent={count} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {compact && (
            <>
              <IconButton color="inherit" aria-label="Открыть меню" onClick={(e) => setAnchor(e.currentTarget)}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
                {navItems.map((item) => (
                  <MenuItem
                    key={item.to}
                    component={NavLink}
                    to={item.to}
                    end={item.end}
                    onClick={() => setAnchor(null)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 3, md: 5 } }}>
        <Box key={pathname} className="fade-in-up">
          <Outlet />
        </Box>
      </Container>

      {import.meta.env.DEV && <DemoModeSwitch />}
    </Box>
  );
}
