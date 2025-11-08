import express from "express";
import prisma from "../db/prisma.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

const validateProfileUpdate = [
  body("displayName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Display name cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Display name must be 50 characters or less"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Bio must be 150 characters or less"),
];

const validateUsername = [
  param("username").trim().notEmpty().withMessage("Username is required"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/me", isLoggedIn, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.patch(
  "/me",
  isLoggedIn,
  validateProfileUpdate,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { displayName, bio } = req.body;
      const userId = req.user.id;

      const updateData = {};
      if (displayName !== undefined) {
        updateData.displayName = displayName;
      }
      if (bio !== undefined) {
        updateData.bio = bio || null;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          username: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

router.get(
  "/:username",
  isLoggedIn,
  validateUsername,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { username } = req.params;
      const currentUserId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          _count: {
            select: {
              posts: true,
              followers: true,
              following: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isFollowing = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id,
          },
        },
      });

      const followsYou = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: currentUserId,
          },
        },
      });

      res.status(200).json({
        ...user,
        isFollowing: isFollowing !== null,
        followsYou: followsYou !== null,
        isOwnProfile: user.id === currentUserId,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  }
);

router.get(
  "/:username/followers",
  isLoggedIn,
  validateUsername,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { username } = req.params;

      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const followers = await prisma.follows.findMany({
        where: { followingId: user.id },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              bio: true,
            },
          },
        },
      });

      res.status(200).json(followers.map((f) => f.follower));
    } catch (error) {
      console.error("Error fetching followers:", error);
      res.status(500).json({ error: "Failed to fetch followers" });
    }
  }
);

router.get(
  "/:username/following",
  isLoggedIn,
  validateUsername,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { username } = req.params;

      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const following = await prisma.follows.findMany({
        where: { followerId: user.id },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              bio: true,
            },
          },
        },
      });

      res.status(200).json(following.map((f) => f.following));
    } catch (error) {
      console.error("Error fetching following:", error);
      res.status(500).json({ error: "Failed to fetch following" });
    }
  }
);

export default router;
