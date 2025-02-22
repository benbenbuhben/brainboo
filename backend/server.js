// server.js
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import Message from './models/Message.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/brainboo';

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO logic
const onlineUsers = new Map();
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('register', (userId) => {
    try {
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is online with socket ID ${socket.id}`);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    try {
      const receiverSocketId = onlineUsers.get(receiverId);
      const senderSocketId = onlineUsers.get(socket.id);
      if (receiverSocketId) {
        const newMessage = new Message({
          sender: senderId, // auth0Id
          receiver: receiverId, // auth0Id
          content: message,
        });
        await newMessage.save();
        io.to(receiverSocketId).emit('receiveMessage', { senderId, receiverId, message });

        if (senderSocketId) {
          io.to(senderSocketId).emit('receiveMessage', { senderId, receiverId, message });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    try {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} is offline`);
          break;
        }
      }
    } catch (error) {
      console.error('Error disconnecting user:', error);
    }
  });
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });