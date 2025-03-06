import React, { useState } from 'react';
import { CircularProgress, Typography, Box, Button } from '@mui/material';
import { useDiscoverUsers, useSubmitSwipe } from '../hooks';
import { UserCard } from '../components';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DiscoverPage() {
  const { discoverUsers, error, isLoading } = useDiscoverUsers();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: submitSwipe } = useSubmitSwipe();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!discoverUsers || discoverUsers.length === 0 || currentIndex >= discoverUsers.length) {
    return <Typography
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
    >No more potential study partners found!</Typography>;
  }

  const currentUser = discoverUsers[currentIndex];

  const handleSwipe = async (liked) => {
    setIsSubmitting(true);
    // Submit the swipe action:
    submitSwipe({ swipeeId: currentUser._id, liked });

    await sleep(1000); // Simulate network delay
    setIsSubmitting(false);
    // Move to the next user:
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {isSubmitting ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography>Processing your swipe...</Typography>
        </Box>
      ) : (
        <>
          <UserCard user={currentUser} />
          <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleSwipe(false)}
              disabled={isSubmitting}
            >
              No
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSwipe(true)}
              disabled={isSubmitting}
            >
              Yes
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}