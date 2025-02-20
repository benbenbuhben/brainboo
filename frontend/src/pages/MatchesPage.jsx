import { useAuth0 } from "@auth0/auth0-react";
import { useMatches } from "../../hooks";
import  { useState } from "react";


export default function MatchesPage() {
  const { isAuthenticated, user } = useAuth0();
  const { matches, isLoading, error } = useMatches();
  const [ chatPeerId, setChatPeerId ] = useState(null);
  const [ openChat, setOpenChat ] = useState(false);

  if (!isAuthenticated) {
    return <div>Please log in to view your matches.</div>;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error loading matches: {error.message}</Typography>;
  }

  const handleChatClick = (peerId) => {
    setChatPeerId(peerId);
    setOpenChat(true);
  };

  const handleChatClose = () => {
    setChatPeerId(null);
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
          {matches.map((match) => (
            <ListItem key={match._id}>
              {match.user1._id !== user._id ? (
                <ListItemAvatar>
                  <Avatar src={match.user1.profilePicture} alt={match.user1.name} />
                </ListItemAvatar>
              ) : (
                <ListItemAvatar>
                  <Avatar src={match.user2.profilePicture} alt={match.user2.name} />
                </ListItemAvatar>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );

}
