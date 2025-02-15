import React, { useState } from 'react';
import { Box, Tabs, Tab, CircularProgress, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserProfile } from '../../hooks';
import ProfileForm from './ProfileForm';
import ProfileView from './ProfileView';

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth0();
  const { profile, isLoading, error, refetch } = useUserProfile();
  const [tabIndex, setTabIndex] = useState(0);

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  if (isLoading) {
    return <CircularProgress />;
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
    <Box sx={{ padding: '1rem' }}>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Profile Tabs">
        <Tab label="View Profile" />
        <Tab label="Edit Profile" />
      </Tabs>
      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && <ProfileView profile={profile} userEmail={user.email} />}
        {tabIndex === 1 && <ProfileForm profile={profile} refetch={refetch} />}
      </Box>
    </Box>
  );
}
