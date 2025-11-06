import express from "express";
import passport from "../config/passport.js";
import prisma from "../db/prisma.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:userId", isLoggedIn, async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.userId);

    if (followerId === followingId) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    const userToFollow = await prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    const follow = await prisma.follows.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.status(201).json(follow);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Already following this user" });
    }
    res.status(500).json({ error: "Failed to follow user" });
  }
});

router.delete("/:userId", isLoggedIn, async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.userId);

    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Follow relationship not found" });
    }
    res.status(500).json({ error: "Failed to unfollow user" });
  }
});

export default router;

