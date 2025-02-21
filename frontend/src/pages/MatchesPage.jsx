import { useAuth0 } from "@auth0/auth0-react";
import { useMatches } from "../hooks";
import { useState } from "react";
import { Avatar, Button, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import ChatModal from "../components/ChatModal.jsx";


export default function MatchesPage() {
  const { isAuthenticated, user } = useAuth0();
  const { matches, isLoading, error } = useMatches();
  const [chatPeer, setChatPeer] = useState(null);
  const [openChat, setOpenChat] = useState(false);

  if (!isAuthenticated) {
    return <div>Please log in to view your matches.</div>;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error loading matches: {error.message}</Typography>;
  }

  const handleChatClick = (peer) => {
    setChatPeer(peer);
    setOpenChat(true);
  };

  const handleChatClose = () => {
    setChatPeer(null);
    setOpenChat(false);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {user.name}'s Matches
      </Typography>

      {matches.length === 0 ? (
        <Typography variant="body1">You have no matches yet.</Typography>
      ) : (
        <List>
          {matches.map((match) => {
            const matchedUser = match.user1._id === user.sub ? match.user2 : match.user1;

            return (
              <ListItem key={matchedUser._id} secondaryAction={
                <Button variant="contained" color="primary" onClick={() => handleChatClick(matchedUser)}>
                  Chat
                </Button>
              }>
                <ListItemAvatar>
                  <Avatar src={matchedUser.profilePicture} alt={matchedUser.name} />
                </ListItemAvatar>
                <ListItemText primary={matchedUser.name} secondary={matchedUser.bio || "No bio available"} />
              </ListItem>
            );
          })}
        </List>
      )}

      {/* Chat Modal */}
      <ChatModal open={openChat} onClose={handleChatClose} user={user} peer={chatPeer} />
    </div>
  );
}
