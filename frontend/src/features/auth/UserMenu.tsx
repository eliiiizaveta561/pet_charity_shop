import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useCart } from '@/entities/cart';
import { useSession } from '@/entities/session';
import { useNotify } from '@/shared/ui/notifications';

interface UserMenuProps {
  compact: boolean;
}

export default function UserMenu({ compact }: UserMenuProps) {
  const { user, status, isAdmin, logout } = useSession();
  const { clear, setCharity } = useCart();
  const navigate = useNavigate();
  const notify = useNotify();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  if (status === 'loading') return null;

  if (!user) {
    return (
      <Button component={RouterLink} to="/login" color="inherit" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.6)' }}>
        Войти
      </Button>
    );
  }

  const handleLogout = async () => {
    setAnchor(null);
    await logout();
    // На общем компьютере следующий человек не должен увидеть чужую корзину
    clear();
    setCharity(null);
    navigate('/');
    notify({ message: 'Вы вышли из аккаунта' });
  };

  return (
    <>
      {compact ? (
        <IconButton color="inherit" aria-label="Профиль" onClick={(e) => setAnchor(e.currentTarget)}>
          <AccountCircleIcon />
        </IconButton>
      ) : (
        <Button color="inherit" startIcon={<AccountCircleIcon />} onClick={(e) => setAnchor(e.currentTarget)}>
          {user.name}
        </Button>
      )}
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
          {user.email}
          {isAdmin && ' · администратор'}
        </Typography>
        <Divider />
        <MenuItem component={RouterLink} to="/orders" onClick={() => setAnchor(null)}>
          <ListItemIcon>
            <ReceiptIcon fontSize="small" />
          </ListItemIcon>
          {isAdmin ? 'Все заказы' : 'Мои заказы'}
        </MenuItem>
        {isAdmin && (
          <MenuItem component={RouterLink} to="/admin/products" onClick={() => setAnchor(null)}>
            <ListItemIcon>
              <InventoryIcon fontSize="small" />
            </ListItemIcon>
            Управление товарами
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Выйти
        </MenuItem>
      </Menu>
    </>
  );
}
