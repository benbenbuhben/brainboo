import { Router } from 'express';

import jwtCheck from '../authMiddleware.js';
// import { Swipe, User, Match } from './models';
import Swipe from '../models/Swipe.js';
import User from '../models/User.js';
import Match from '../models/Match.js';

const router = Router();

// POST /api/swipes - Record a swipe action
router.post('/', jwtCheck, async (req, res) => {
  try {
    // Extract the Auth0 user id from the token
    const auth0Id = req.auth.payload.sub;
    if (!auth0Id) {
      return res.status(400).json({ error: 'Missing Auth0 user ID in token.' });
    }

    // Find the current user using their Auth0 ID
    const currentUser = await User.findOne({ auth0Id });
    if (!currentUser) {
      return res.status(404).json({ error: 'Current user not found.' });
    }

    // Destructure the request body for swipe details
    const { swipeeId, liked } = req.body;
    if (swipeeId === undefined || liked === undefined) {
      return res.status(400).json({ error: 'Missing swipeeId or liked value.' });
    }

    // Upsert a Swipe record: if the user already swiped on this person, update it; otherwise, create it.
    const swipe = await Swipe.findOneAndUpdate(
      { swiper: currentUser._id, swipee: swipeeId },
      { liked, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // If the swipe is a "Yes", check for a reciprocal "Yes" from the other user.
    if (liked) {
      const reciprocalSwipe = await Swipe.findOne({
        swiper: swipeeId,
        swipee: currentUser._id,
        liked: true,
      });

      if (reciprocalSwipe) {
        // They mutually liked each other. Create a match if one doesn't already exist.
        // To avoid duplicate matches, order the user IDs consistently.
        const [user1, user2] = [currentUser._id, swipeeId].sort();
        const existingMatch = await Match.findOne({ user1, user2 });
        if (!existingMatch) {
          const match = new Match({ user1, user2 });
          await match.save();
          return res.json({ match: true });
        }
      }
    }

    return res.json({ match: false });
  } catch (error) {
    console.error('Error in POST /api/swipes:', error);
    return res.status(500).json({ error: 'Failed to submit swipe.' });
  }
});

export default router;
