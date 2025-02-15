import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import apiRoutes from './routes/api.js';
import userRoutes from './routes/user.js';

app.use('/api', apiRoutes);
app.use('/api/users', userRoutes);

// A simple test route
app.get('/', (req, res) => {
  res.send('BrainBoo Backend is running!');
});

export default app;
