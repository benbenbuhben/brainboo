// routes/discover.js
import { Router } from 'express';
import jwtCheck from '../authMiddleware.js';
import User from '../models/User.js';
import Swipe from '../models/Swipe.js';

const router = Router();

// GET /api/discover - Retrieve potential study partners
router.get('/', jwtCheck, async (req, res) => {
  try {
    const currentAuth0Id = req.auth.payload.sub;

    // Find the current user's document to get the Mongo _id
    const currentUser = await User.findOne({ auth0Id: currentAuth0Id });
    if (!currentUser) {
      return res.status(404).json({ error: 'Current user not found.' });
    }

    // Option 1: Exclude users that the current user has already swiped on.
    // First, get all swipes by the current user.
    const swipes = await Swipe.find({ swiper: currentUser._id });
    const swipedUserIds = swipes.map(swipe => swipe.swipee);

    // Now find potential users by excluding the current user and those swiped on.
    const potentialUsers = await User.find({
      _id: { $nin: [currentUser._id, ...swipedUserIds] }
    });

    res.json(potentialUsers);
  } catch (error) {
    console.error('Error fetching potential users for discovery:', error);
    res.status(500).json({ error: 'Failed to fetch potential users.' });
  }
});

export default router;
