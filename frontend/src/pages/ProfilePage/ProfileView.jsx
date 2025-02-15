import React from 'react';
import { Box, Typography, Avatar, Grid } from '@mui/material';

export default function ProfileView({ profile, userEmail }) {
  // Use the profile picture from the profile if available,
  // otherwise, you might use a placeholder.
  const profilePicture = profile.profilePicture || 'https://via.placeholder.com/150';

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar
            alt={profile.name}
            src={profilePicture}
            sx={{ width: 100, height: 100 }}
          />
        </Grid>
        <Grid item>
          <Typography variant="h5">{profile.name || 'Unnamed User'}</Typography>
          <Typography variant="subtitle1">{userEmail}</Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1">
          <strong>Major:</strong> {profile.major || 'Not provided'}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Topics:</strong> {profile.topics && profile.topics.length > 0 ? profile.topics.join(', ') : 'Not provided'}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Bio:</strong> {profile.bio || 'No bio provided'}
        </Typography>
      </Box>
    </Box>
  );
}
