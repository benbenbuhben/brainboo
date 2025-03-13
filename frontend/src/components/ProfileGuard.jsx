// src/components/ProfileGuard.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserProfile } from '../hooks';
import { CircularProgress, Typography, Box, Button } from '@mui/material';

export default function ProfileGuard({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const { profile, isLoading: profileLoading } = useUserProfile();

  if (authLoading || profileLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          minHeight: '60vh',
          width: '100%',
          marginTop: '2rem'
        }}
      >
        <CircularProgress size={60} sx={{ color: '#f62f79' }} />
      </Box>
    );
  }

  // Only display the prompt if the user is authenticated,
  // the profile is missing or incomplete (profileComplete is false),
  // and they are not already on the /profile page.
  if (isAuthenticated && (!profile || !profile.profileComplete) && location.pathname !== '/profile') {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Before accessing this page, please complete your profile.
        </Typography>
        <Button variant="contained" component={Link} to="/profile">
          Complete Profile
        </Button>
      </Box>
    );
  }

  return children;
}
