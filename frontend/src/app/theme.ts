import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1f6f5c', dark: '#16503f', contrastText: '#ffffff' },
    secondary: { main: '#e9a23b', contrastText: '#19302b' },
    background: { default: '#f4f8f6', paper: '#ffffff' },
    text: { primary: '#19302b', secondary: '#4d645e' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Nunito", "Segoe UI", Roboto, Arial, sans-serif',
    h1: { fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.15 },
    h2: { fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' },
    h3: { fontWeight: 700, fontSize: '1.5rem' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { defaultProps: { variant: 'outlined' } },
    MuiPaper: { defaultProps: { variant: 'outlined' } },
  },
});

export default theme;
