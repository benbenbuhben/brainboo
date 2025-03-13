import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import AppRoutes from './routes';

export default function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          pt: '64px', // Enough to offset the fixed navbar height
          margin: '0 auto',
          minHeight: '100vh',
        }}
      >
        <AppRoutes />
      </Box>
    </ThemeProvider>
  );
}

