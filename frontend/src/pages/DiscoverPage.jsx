import React, { useState } from 'react';
import { CircularProgress, Typography, Box, Button } from '@mui/material';
import { useDiscoverUsers, useSubmitSwipe } from '../hooks';
import { UserCard } from '../components';

export default function DiscoverPage() {
  const { discoverUsers, error, isLoading } = useDiscoverUsers();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { mutate: submitSwipe } = useSubmitSwipe();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!discoverUsers || discoverUsers.length === 0 || currentIndex >= discoverUsers.length) {
    return <Typography>No more potential study partners found!</Typography>;
  }

  const currentUser = discoverUsers[currentIndex];

  const handleSwipe = (liked) => {
    // Submit the swipe action:
    submitSwipe({ swipeeId: currentUser._id, liked });
    // Move to the next user:
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <UserCard user={currentUser} />
      <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
        <Button variant="outlined" color="error" onClick={() => handleSwipe(false)}>
          No
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleSwipe(true)}>
          Yes
        </Button>
      </Box>
    </Box>
  );
}
