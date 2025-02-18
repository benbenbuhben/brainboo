// src/components/UserCard.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

export default function UserCard({ user }) {
  return (
    <Card sx={{ maxWidth: 345, margin: '1rem auto' }}>
      <CardMedia
        component="img"
        height="140"
        image={user.profilePicture || 'https://www.gravatar.com/avatar/placeholder'}
        alt={user.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5">
          {user.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Major: {user.major || 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  );
}
