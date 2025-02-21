import { Router } from "express";
import User from "../models/User.js";
import jwtCheck from "../authMiddleware.js";
import Match from '../models/Match.js';

const router = Router();

router.get("/", jwtCheck, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    if (!auth0Id) {
      return res.status(400).json({ error: "Missing Auth0 user ID in token." });
    }

    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const matches = await Match.find({ $or: [{ user1: user._id }, { user2: user._id }] })
      .populate("user1", "name email profilePicture")
      .populate("user2", "name email profilePicture");

    const matchedUsers = matches.map(match => {
      return match.user1.auth0Id === auth0Id ? match.user2 : match.user1;
    })
    res.json(matchedUsers);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve matches." });
  }
});

export default router;