import React, { useState } from 'react';
import { Box, Tabs, Tab, CircularProgress, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

import { useUserProfile } from '../../hooks';
import ProfileEdit from './ProfileEdit';
import ProfileView from './ProfileView';

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth0();
  const { profile, isLoading, error, refetch } = useUserProfile();
  const [tabIndex, setTabIndex] = useState(0);

  if (!isAuthenticated) {
    return <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
    >Please log in to view your profile.</div>;
  }

  if (isLoading) {
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

  if (error) {
    return (
      <Typography color="error">
        Error loading profile: {error.message}
      </Typography>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Profile Tabs"
        sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: "transparent important!" }}>
        <Tab
          sx={{
            textTransform: 'none',
            fontWeight: 'medium',
            outline: 'none',
            "&:hover": {
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              color: '#000000',
            },
            "&:focus": {
              outline: 'none',
            }
          }}
          label="Edit Profile"
        />
        <Tab
          sx={{
            textTransform: 'none',
            fontWeight: 'medium',
            outline: 'none',
            "&:hover": {
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              color: '#000000',
            },
            "&:focus": {
              outline: 'none',
            }
          }}
          label="View Profile"
        />
      </Tabs>
      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && <ProfileEdit profile={profile} refetch={refetch} />}
        {tabIndex === 1 && <ProfileView profile={profile} userEmail={user.email} />}
      </Box>
    </Box>
  );
}
