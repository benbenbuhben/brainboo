import { Router } from 'express';
import User from '../models/User.js';
import jwtCheck from '../authMiddleware.js';
import Match from '../models/Match.js';

const router = Router();

router.get('/', jwtCheck, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    if (!auth0Id) {
      return res.status(400).json({ error: 'Missing Auth0 user ID in token.' });
    }

    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Fetch matches and populate full user details
    const matches = await Match.find({
      $or: [{ user1: user._id }, { user2: user._id }],
    })
      .populate('user1') // Full user1 details
      .populate('user2'); // Full user2 details

    // Map to return only the "other user" with full info
    const matchedUsers = matches.map((match) => {
      const otherUser = match.user1.auth0Id === auth0Id ? match.user2 : match.user1;
      return {
        _id: otherUser._id,
        auth0Id: otherUser.auth0Id,
        email: otherUser.email,
        name: otherUser.name,
        profilePicture: otherUser.profilePicture,
        major: otherUser.major,
        topics: otherUser.topics,
        bio: otherUser.bio,
        profileComplete: otherUser.profileComplete,
      };
    });

    res.json(matchedUsers);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to retrieve matches.' });
  }
});

export default router;