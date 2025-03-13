import React, { useState } from 'react';
import { CircularProgress, Typography, Box, Button } from '@mui/material';
import { Favorite, HeartBroken } from '@mui/icons-material';
import ReactConfetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiscoverUsers, useSubmitSwipe, useUserProfile } from '../hooks';
import { UserCard } from '../components';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DiscoverPage() {
  const { discoverUsers, error, isLoading } = useDiscoverUsers();
  const { profile: currentUser } = useUserProfile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: submitSwipe } = useSubmitSwipe();
  const [showConfetti, setShowConfetti] = useState(false);

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
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!discoverUsers || discoverUsers.length === 0 || currentIndex >= discoverUsers.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          gap: 3
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#f62f79',
            fontWeight: 'bold',
            marginBottom: 2
          }}
        >
          All Caught Up! 🎓
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#666',
            maxWidth: '600px',
            lineHeight: 1.6
          }}
        >
          You've explored all potential study partners for now. Check back soon for new matches!
        </Typography>
      </Box>
    );
  }

  const displayedUser = discoverUsers[currentIndex];

  const handleSwipe = async (liked) => {
    // Submit the swipe action:
    try {
      const result = await submitSwipe({ swipeeId: displayedUser._id, liked });
      if (result?.match) {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }
      setIsSubmitting(true);
    } catch (error) {
      console.error('Failed to submit swipe:', error);
    } finally {
      await sleep(3000); // Simulate network delay
      setIsSubmitting(false);
      setCurrentIndex((prev) => prev + 1);
    }


  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {showConfetti && (
        <>
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}>
              <Typography
                variant="h4"
                sx={{
                  color: '#f62f79',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >Congrats! You have a match! 🎉
              </Typography>
            </motion.div>

          </Box>
        </>
      )}
      {isSubmitting ? (
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
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: '#666',
              letterSpacing: '0.5px'
            }}
          >
            Getting next boo...
          </Typography>
        </Box>
      ) : (
        <>
          <UserCard user={displayedUser} currentUser={currentUser} />
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
