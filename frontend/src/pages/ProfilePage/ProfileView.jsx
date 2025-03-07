import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ProfileCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  }
}));


const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 50,
  height: 50,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
}));

const InfoBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginTopp: theme.spacing(2),
}));


export default function ProfileView({ profile, userEmail }) {
  // Use the profile picture from the profile if available,
  // otherwise, you might use a placeholder.
  const profilePicture = profile.profilePicture || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  return (
    <Box sx={{ py: 4, px: 2 }}>
      <ProfileCard>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <StyledAvatar
                alt={profile.name}
                src={profilePicture}
              />
            </Grid>
            <Grid item xs>
              <Typography
                variant="h6"
                component="h1"
                color='primary'
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {profile.name || 'Unnamed User'}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {userEmail}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <InfoBox>
            <Typography
              variant="body1"
              sx={{
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <strong>Major:</strong>
              <span style={{ color: "#555" }}> {profile.major || 'Not provided'}</span>
            </Typography>
            <Typography
              variant='body1'
              sx={{
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
              <strong>Bio:</strong>
              <span style={{ color: "#555" }}>{profile.bio || "No bio provided"}</span>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
              <strong>Topics: </strong>
              </Typography>
              {profile.topics && profile.topics.length > 0 ? (
                profile.topics.map((topic, index) => (
                  <Chip
                    key={index}
                    label={topic}
                    sx={{ backgroundColor: "#f62f79", color: "#ffffff", "&:hover": { backgroundColor: "#fcbe31" } }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  "No topics specified"
                </Typography>
              )}
            </Box>


          </InfoBox>

        </CardContent>
      </ProfileCard>
    </Box>
  );
}
