import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Dialog, TextField, Button, Typography } from "@mui/material";
import { getChats } from "../api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const socket = io(API_URL);

export default function ChatModal({ open, onClose, user, peer }) {
    const { getAccessTokenSilently } = useAuth0();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (user && peer) {
            socket.emit("register", user.sub);

            const fetchChats = async () => {
                const chats = await getChats(getAccessTokenSilently, user.sub, peer?._id);
                setMessages(chats || []);
            };

            fetchChats();
        }

        socket.on("receiveMessage", (data) => {
            setMessages((prev) => [...prev, { sender: data.senderId, text: data.message }]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [user, peer]);

    const sendMessage = () => {
        if (newMessage.trim() && peer) {
            const messageData = { senderId: user.sub, receiverId: peer._id, message: newMessage };
            socket.emit("sendMessage", messageData);
            setMessages((prev) => [...prev, { sender: user.sub, text: newMessage }]);
            setNewMessage("");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <div style={{ padding: "20px" }}>
                <Typography variant="h6">{`Chat with ${peer?.name}`}</Typography>
                <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ textAlign: msg.sender === user.sub ? "right" : "left" }}>
                            <Typography
                                style={{
                                    background: msg.sender === user.sub ? "#4caf50" : "#f1f1f1",
                                    padding: "5px 10px",
                                    borderRadius: "8px",
                                    display: "inline-block"
                                }}>
                                {msg.text}
                            </Typography>
                        </div>
                    ))}
                </div>
                <TextField
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..." />
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
