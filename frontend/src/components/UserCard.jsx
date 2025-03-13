import React from 'react';
import { Card, Box, CardContent, CardMedia, Chip, Typography } from '@mui/material';

export default function UserCard({ user, currentUser }) {
  // 1) Safely handle topics arrays
  const displayedUserTopics = user?.topics || [];
  const currentUserTopics = currentUser?.topics || [];

  return (
    <Card sx={{ maxWidth: 500, width: '100%', margin: '2rem auto', boxShadow: 3 }}>
      <CardMedia
        component="img"
        image={user.profilePicture || 'https://www.gravatar.com/avatar/placeholder'}
        alt={user.name}
        sx={{
          objectFit: 'contain',
          width: '100%',
          height: 'auto',
          maxHeight: '300px',
          backgroundColor: '#f5f5f5',
        }}
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
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Major:</strong> {user.major || 'N/A'}
        </Typography>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Topics of interest:</strong>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {displayedUserTopics.length > 0 ? (
            // Create a sorted copy: common topics first.
            [...displayedUserTopics]
              .sort((a, b) => {
                const aCommon = currentUserTopics.includes(a);
                const bCommon = currentUserTopics.includes(b);
                // If both are common or both aren't, maintain their order.
                if (aCommon === bCommon) return 0;
                return aCommon ? -1 : 1;
              })
              .map((topic, index) => {
                const isCommon = currentUserTopics.includes(topic);

                // If it's a common topic, pink background + white text
                // Otherwise, pink border + black text
                const chipSx = isCommon
                  ? {
                      backgroundColor: '#f62f79',
                      color: '#ffffff',
                      '&:hover': { backgroundColor: '#fcbe31' },
                    }
                  : {
                      border: '1px solid #f62f79',
                      color: '#000000',
                      backgroundColor: '#ffffff',
                      '&:hover': { backgroundColor: '#fff0f5' },
                    };

                return <Chip key={index} label={topic} sx={chipSx} />;
              })
          ) : (
            <Typography variant="body2" color="text.secondary">
              No topics specified
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
