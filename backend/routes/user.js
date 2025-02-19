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
    let user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update only the provided fields.
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.profilePicture !== undefined) user.profilePicture = req.body.profilePicture;
    if (req.body.major !== undefined) user.major = req.body.major;
    if (req.body.topics !== undefined) user.topics = req.body.topics;
    if (req.body.bio !== undefined) user.bio = req.body.bio;

    // The pre-save hook will run when .save() is called.
    user = await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
});


export default router;
