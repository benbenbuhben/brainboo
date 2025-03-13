import { Router } from 'express';
import jwtCheck from '../authMiddleware.js';
import User from '../models/User.js';
import Swipe from '../models/Swipe.js';

const router = Router();

router.get('/', jwtCheck, async (req, res) => {
  try {
    const currentAuth0Id = req.auth.payload.sub;
    const currentUser = await User.findOne({ auth0Id: currentAuth0Id });
    if (!currentUser) {
      return res.status(404).json({ error: 'Current user not found.' });
    }

    // Get a list of user IDs that the current user has swiped on
    const swipes = await Swipe.find({ swiper: currentUser._id });
    const swipedUserIds = swipes.map(swipe => swipe.swipee);

    // Aggregation pipeline:
    const pipeline = [
      // 1) Exclude current user + anyone they've already swiped
      {
        $match: {
          _id: { $nin: [currentUser._id, ...swipedUserIds] }
        }
      },
      // 2) Compute partial “similarity” fields
      {
        $addFields: {
          // +2 if major matches, else 0
          majorMatch: {
            $cond: [{ $eq: ["$major", currentUser.major] }, 2, 0]
          },
          // Number of overlapping topics
          topicIntersection: {
            $size: {
              $setIntersection: ["$topics", currentUser.topics]
            }
          }
        }
      },
      // 3) Combine them into a single “similarityScore”
      {
        $addFields: {
          similarityScore: { $add: ["$majorMatch", "$topicIntersection"] }
        }
      },
      // 4) Sort descending by that similarityScore
      {
        $sort: { similarityScore: -1 }
      },
      // 5) Optionally limit/paginate
      // { $limit: 50 }, etc.
    ];

    const potentialUsers = await User.aggregate(pipeline);
    res.json(potentialUsers);
  } catch (error) {
    console.error('Error fetching potential users sorted:', error);
    res.status(500).json({ error: 'Failed to fetch sorted users.' });
  }
});

export default router;
