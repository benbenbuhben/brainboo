// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth0();
  return (
    <>
      {/* HERO SECTION */}
      <Box
        sx={{
          width: '100%',
          minHeight: 'calc(100vh - 64px)', // Full height minus a ~64px fixed navbar    
          background: 'linear-gradient(135deg, #f62f79 0%, #fcbe31 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Centered hero text */}
        <Box sx={{ textAlign: 'center', color: '#ffffff', maxWidth: 600, mx: 'auto', p: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Welcome to BrainBoo
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Find your perfect study buddy and boost your learning experience!
          </Typography>
          <Button
            component={Link}
            to={isAuthenticated ? "/discover" : "/login"}
            variant="contained"
            sx={{
              backgroundColor: '#ffffff',
              color: '#f62f79',
              fontWeight: 700,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* SECONDARY CONTENT SECTION */}
      <Box
        sx={{
          width: '100%',
          py: 8, // Some vertical padding
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Column: Text */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: '#fcbe31' }}>
                How BrainBoo Works
              </Typography>
              <Typography variant="body1" sx={{ color: '#1b2e35', mb: 4 }}>
                BrainBoo connects you with peers who share your interests and major, 
                making collaboration seamless and fun.
                <br />
                No more searching endlessly for the perfect study partner!
              </Typography>
            </Grid>

            {/* Right Column: Image */}
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src="/landing.jpg" 
                  alt="Funny BrainBoo" 
                  style={{ maxWidth: '100%', borderRadius: '8px' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
