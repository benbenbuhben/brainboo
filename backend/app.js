// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import apiRoutes from './routes/api.js';
import userRoutes from './routes/user.js';
import discoverRoutes from './routes/discover.js';
import swipeRoutes from './routes/swipe.js'; // Import the swipe route
import matchRoutes from './routes/match.js'; // Import the match route
import Message from './models/Message.js';

app.use('/api', apiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/swipes', swipeRoutes); // Register the swipe endpoint
app.use('/api/matches', matchRoutes); // Register the match endpoint

// Chat 
const onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online with socket ID ${socket.id}`);
  });

  socket.on("sendMessage", async ( { senderId, receiverId, message } ) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        content: message,
      });
      await newMessage.save();
      io.to(receiverSocketId).emit("message", {
        senderId,
        receiverId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} is offline`);
        break;
      }
    }
  });
});

// Start the server
server.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

// A simple test route
app.get('/', (req, res) => {
  res.send('BrainBoo Backend is running!');
});



export default app;
