import React from 'react';
import { Card, Box, CardContent, CardMedia, Chip, Typography } from '@mui/material';

export default function UserCard({ user }) {
  return (
    <Card sx={{ maxWidth: 500, width: '100%', height: 'auto', margin: '2rem auto', boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="200"
        image={user.profilePicture || 'https://www.gravatar.com/avatar/placeholder'}
        alt={user.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ padding: 3 }}>
        <Typography gutterBottom variant="h4" component="div">
          {user.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Bio: </strong> {user.bio || 'No bio available'}
          <br />
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Major:</strong> {user.major || 'N/A'}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Topics of interest:</strong>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {user.topics && user.topics.length > 0 ? (
            user.topics.slice(0, 4).map((topic, index) => (
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

      </CardContent>
    </Card>
  );
}
