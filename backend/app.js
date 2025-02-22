// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import userRoutes from './routes/user.js';
import discoverRoutes from './routes/discover.js';
import swipeRoutes from './routes/swipe.js';
import matchRoutes from './routes/match.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Routes
app.use('/api', apiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/swipes', swipeRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chats', chatRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('BrainBoo Backend is running!');
});

// Export app without starting the server
export default app;