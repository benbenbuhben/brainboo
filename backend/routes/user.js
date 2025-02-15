import { Router } from 'express';
import User from '../models/User.js';
import jwtCheck from '../authMiddleware.js';

const router = Router();

// GET /api/users/me - Retrieve the current user's profile.
router.get('/me', jwtCheck, async (req, res) => {
  try {
    // Since jwtCheck verifies the token, you can trust the token claims.
    // For example, if you set up your token to include the user's Auth0 ID in the 'sub' claim:
    const auth0Id = req.auth.payload.sub;
    if (!auth0Id) {
      return res.status(400).json({ error: 'Missing Auth0 user ID in token.' });
    }

    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user.' });
  }
});

// POST /api/users - Create a new user profile.
// In a secure environment, extract the Auth0 ID from a verified token.
router.post('/', async (req, res) => {
  try {
    const { auth0Id, email, name, profilePicture } = req.body;
    if (!auth0Id || !email) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const user = await User.findOneAndUpdate(
      { auth0Id },
      { auth0Id, email, name, profilePicture },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return res.status(500).json({ error: 'Failed to create or update user.' });
  }
});


// PUT /api/users/me - Update the current user's profile.
router.put('/me', jwtCheck, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const { name, profilePicture, major, topics, bio } = req.body;

    // Create an object with only the provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (major !== undefined) updateData.major = major;
    if (topics !== undefined) updateData.topics = topics;
    if (bio !== undefined) updateData.bio = bio;

    const user = await User.findOneAndUpdate({ auth0Id }, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

export default router;
