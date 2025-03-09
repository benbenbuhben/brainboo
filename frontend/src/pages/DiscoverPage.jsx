import React, { useState } from 'react';
import { CircularProgress, Typography, Box, Button } from '@mui/material';
import { Favorite, HeartBroken } from '@mui/icons-material';
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
    return (
      <Typography
        style={{ textAlign: 'center' }}
      >
        No more potential study partners found!
      </Typography>
    );
  }

  const currentUser = discoverUsers[currentIndex];

  const handleSwipe = async (liked) => {
    setIsSubmitting(true);
    submitSwipe({ swipeeId: currentUser._id, liked });
    await sleep(1000);
    setIsSubmitting(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    // Use full height (minus navbar) & center content
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 64px)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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
              onClick={() => handleSwipe(false)}
              sx={{
                borderColor: "#000000 !important",
                backgroundColor: "#ffffff !important",
                color: "#000000 !important",
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  backgroundColor: "#f5f5f5 !important",
                  borderColor: "#000000 !important",
                }
              }}
            >
              No
              <HeartBroken sx={{ color: "#000000" }} />
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSwipe(true)}
              sx={{
                backgroundColor: "#f62f79 !important",
                color: "#ffffff !important",
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  backgroundColor: "#e0296a !important",
                }
              }}
            >
              Yes
              <Favorite sx={{ color: '#ffffff' }} />
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
