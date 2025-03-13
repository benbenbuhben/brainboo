import { useAuth0 } from "@auth0/auth0-react";
import { useMatches } from "../hooks";
import { useState } from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import ChatModal from "../components/ChatModal.jsx";


export default function MatchesPage() {
  const { isAuthenticated, user } = useAuth0();
  const { matches, isLoading, error } = useMatches();
  const [chatPeer, setChatPeer] = useState(null);
  const [openChat, setOpenChat] = useState(false);

  if (!isAuthenticated) {
    return <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
    >Please log in to view your matches.</div>;
  }

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
    return <Typography color="error">Error loading matches: {error.message}</Typography>;
  }

  const truncateBio = (bio, maxLength = 30) => {
    if (!bio) return 'No bio available';
    return bio.length > maxLength ? bio.substring(0, maxLength) + '...' : bio;
  };

  const handleChatClick = (peer) => {
    setChatPeer(peer);
    setOpenChat(true);
  };

  const handleChatClose = () => {
    setChatPeer(null);
    setOpenChat(false);
  };

  return (
    <Box
      sx={{
        paddingTop: '80px', // Offset for fixed navbar
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)', // Full viewport height minus navbar
        backgroundColor: '#fcfbf2', // Match your theme
        position: 'relative', // Ensure content is positioned correctly
      }}
    >
      <Box
        sx={{
          maxWidth: '600px', // Constrain width
          width: '100%', // Ensure it takes full width up to maxWidth
          textAlign: 'center', // Center text within the box
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          {user.name}'s Matches
        </Typography>

        {matches && matches.length === 0 ? (
          <Typography variant="body1">You have no matches yet.</Typography>
        ) : (
          matches && (
            <List sx={{ width: '100%' }}>
              {matches.map((matchedUser) => (
                <ListItem
                  key={matchedUser._id}
                  sx={{
                    border: '2px solid #fdcb00', // Outline with yellow border
                    borderRadius: '8px',
                    mb: 2, // Margin-bottom for spacing between items
                    p: 2, // Padding inside the ListItem
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap', // Allow wrapping if needed
                  }}
                  secondaryAction={
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleChatClick(matchedUser)}
                      sx={{ flexShrink: 0, mt: { xs: 1, sm: 0 } }} // Margin-top on small screens if wrapped
                    >
                      Chat
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={matchedUser.profilePicture}
                      alt={matchedUser.name}
                      sx={{ bgcolor: matchedUser.profilePicture ? null : '#fdcb00', width: 40, height: 40 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {matchedUser.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {truncateBio(matchedUser.bio)}
                      </Typography>
                    }
                    sx={{ flex: 1, minWidth: 0, mr: 2 }}
                  />
                </ListItem>
              ))}
            </List>
          )
        )}

        {/* Chat Modal */}
        <ChatModal open={openChat} onClose={handleChatClose} user={user} peer={chatPeer} />
      </Box>
    </Box>
  );
}
