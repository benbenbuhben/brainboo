// frontend/src/components/ChatModal.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Typography,
  Box
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { getChats } from "../api";
import { useChatSummary } from "../hooks";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const socket = io(API_URL);

export default function ChatModal({ open, onClose, user, peer }) {
  const { getAccessTokenSilently } = useAuth0();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const chatContainerRef = useRef(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const { mutate: summarizeChat, isPending: isSummarizing } = useChatSummary();

  useEffect(() => {
    if (user && peer && open) {
      socket.emit("register", user.sub);

      const fetchInitialChats = async () => {
        const chats = await getChats(getAccessTokenSilently, user.sub, peer?.auth0Id, 10, 0);
        setMessages(chats || []);
        setPage(1);
        setHasMore(chats.length === 10);
        setInitialLoad(true);
      };

      fetchInitialChats();
    }

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, { sender: data.senderId, content: data.message }]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user, peer, getAccessTokenSilently, open]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      if (initialLoad) {
        setInitialLoad(false);
      }
    }
  }, [messages, initialLoad]);

  const handleScroll = async () => {
    const container = chatContainerRef.current;
    if (container && container.scrollTop === 0 && hasMore && !initialLoad) {
      const prevHeight = container.scrollHeight;
      const moreMessages = await getChats(getAccessTokenSilently, user.sub, peer?.auth0Id, 10, page * 10);
      if (moreMessages.length > 0) {
        setMessages((prev) => [...moreMessages, ...prev]); // Prepend older messages
        setPage((prev) => prev + 1);
        setHasMore(moreMessages.length === 10);

        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight - prevHeight;
        });
      } else {
        setHasMore(false);
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && peer) {
      const messageData = { senderId: user.sub, receiverId: peer?.auth0Id, message: newMessage };
      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  const handleSummarize = () => {
    if (!user || !peer) return;
  
    // Add an initial AI message with placeholder text.
    setMessages((prev) => [
      ...prev,
      { sender: "AI", content: "AI Says: " }
    ]);
  
    summarizeChat(
      {
        senderId: user.sub,
        receiverId: peer.auth0Id,
        // The onChunk callback now parses JSON objects.
        onChunk: (chunk) => {
          // Use a regex to match complete JSON objects in the chunk.
          const regex = /{[^}]+}/g;
          const matches = chunk.match(regex);
          if (matches) {
            matches.forEach((match) => {
              try {
                const parsed = JSON.parse(match);
                const text = parsed.response;
                if (text) {
                  // Append the response text only.
                  setMessages((prev) => {
                    const lastMsg = prev[prev.length - 1];
                    const updatedMsg = { ...lastMsg, content: lastMsg.content + text };
                    return [...prev.slice(0, -1), updatedMsg];
                  });
                }
              } catch (error) {
                console.error("Error parsing JSON chunk:", error);
              }
            });
          }
        }
      },
      {
        onError: (error) => {
          console.error("Summarization failed:", error);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiDialog-paper': {
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          borderBottom: "1px solid #ccc",
          flexShrink: 0,
        }}>
        <Typography variant="h5">{`Chat with ${peer?.name}`}</Typography>
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", right: "10px", top: "10px" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "0 20px 20px 20px",
          overflowY: "auto",
        }}>
        <div
          ref={chatContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            backgroundColor: "#fafafa",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
          onScroll={handleScroll}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{ textAlign: msg.sender === user.sub ? "right" : "left" }}
            >
              <Typography
                style={{
                  background: msg.sender === user.sub ? "#f62f79" : "#f1f1f1",
                  color: msg.sender === user.sub ? "#ffffff" : "#000000",
                  padding: "5px 10px",
                  borderRadius: "8px",
                  display: "inline-block",
                }}
              >
                {msg.content}
              </Typography>
            </div>
          ))}
        </div>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={sendMessage}>
              Send
            </Button>
            <Button
              variant="outlined"
              onClick={handleSummarize}
              disabled={isSummarizing}
            >
              {isSummarizing ? "Summarizing..." : "Summarize with AI"}
            </Button>
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
