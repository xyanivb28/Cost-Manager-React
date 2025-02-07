import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#578E7E', // Muted teal
    },
    secondary: {
      main: '#3D3D3D', // Dark gray
    },
    background: {
      default: '#FFFAEC', // Light beige
      paper: '#F5ECD5', // Darker beige
    },
    text: {
      primary: '#3D3D3D', // Dark gray
      secondary: '#578E7E', // Muted teal
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#578E7E', // Muted teal
    },
    secondary: {
      main: '#F5ECD5', // Darker beige
    },
    background: {
      default: '#3D3D3D', // Dark gray
      paper: '#1E1E1E', // Even darker gray
    },
    text: {
      primary: '#FFFAEC', // Light beige
      secondary: '#578E7E', // Darker beige
    },
  },
});

export { lightTheme, darkTheme };