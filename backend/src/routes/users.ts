import express from "express";
import prisma from "../db/prisma.js";
import { optionalAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", optionalAuth, async (req, res) => {
  try {
    const currentUserId = req.user?.id ?? null;

    // TODO: Add pagination to users fetch
    const users = await prisma.user.findMany({
      where: currentUserId ? { id: { not: currentUserId } } : {},
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
      orderBy: {
        username: "asc",
      },
    });

    if (!currentUserId) {
      return res.status(200).json(
        users.map((user) => ({ ...user, isFollowing: false }))
      );
    }

    const followingRelationships = await prisma.follows.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });

    const followingIds = new Set(
      followingRelationships.map((f) => f.followingId),
    );

    const usersWithFollowStatus = users.map((user) => ({
      ...user,
      isFollowing: followingIds.has(user.id),
    }));

    res.status(200).json(usersWithFollowStatus);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
