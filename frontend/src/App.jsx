import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import AppRoutes from './routes';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          maxWidth: '70%',
          margin: '0 auto',
          minHeight: '100vh',
        }}
      >
        <AppRoutes />
      </Box>
    </ThemeProvider>
  );
}

export default App;