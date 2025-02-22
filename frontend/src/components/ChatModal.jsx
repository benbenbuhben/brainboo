import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Dialog, TextField, Button, Typography } from "@mui/material";
import { getChats } from "../api";

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
  }, [messages]);

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

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <div style={{ padding: "20px" }}>
        <Typography variant="h6">{`Chat with ${peer?.name}`}</Typography>
        <div
          ref={chatContainerRef}
          style={{
            height: "300px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
          }}
          onScroll={handleScroll}
        >
          {messages.map((msg, index) => (
            <div key={index} style={{ textAlign: msg.sender === user.sub ? "right" : "left" }}>
              <Typography
                style={{
                  background: msg.sender === user.sub ? "#4caf50" : "#f1f1f1",
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
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button variant="contained" color="primary" onClick={sendMessage} style={{ marginTop: "10px" }}>
          Send
        </Button>
        <Button onClick={onClose} color="secondary" style={{ marginTop: "10px" }}>
          Close
        </Button>
      </div>
    </Dialog>
  );
}