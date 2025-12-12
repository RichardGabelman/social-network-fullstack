import express from "express";
import prisma from "../db/prisma.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";
import { body, param, validationResult } from "express-validator";

const PRISMA_UNIQUE_CONSTRAINT_ERROR = "P2002";
const PRISMA_NOT_FOUND_ERROR = "P2025";

const router = express.Router();

const validatePost = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Post content is required")
    .isLength({ max: 500 })
    .withMessage("Post content must be 500 characters or less"),
  body("replyToId")
    .optional()
    .isInt()
    .withMessage("Reply ID must be a valid integer"),
];

const validatePostId = [
  param("postId").isInt().withMessage("Post ID must be a valid integer"),
];

const validateUserId = [
  param("userId").isInt().withMessage("User ID must be a valid integer"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/",
  isLoggedIn,
  validatePost,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { content, replyToId } = req.body;
      const authorId = req.user.id;

      if (replyToId) {
        const parentPost = await prisma.post.findUnique({
          where: { id: parseInt(replyToId) },
        });
        if (!parentPost) {
          return res.status(404).json({ error: "Parent post not found" });
        }
      }

      const post = await prisma.post.create({
        data: {
          content,
          authorId,
          replyToId: replyToId ? parseInt(replyToId) : null,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
        },
      });

      res.status(201).json(post);
    } catch (error) {
      console.log("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  }
);

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;

    const following = await prisma.follows.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    // following + self posts
    const authorIds = [...followingIds, userId];

    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: authorIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            isReplyToDeleted: true,
            author: {
              select: {
                username: true,
                displayName: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      take: 50,
    });

    const postsWithLikeStatus = await Promise.all(
      posts.map(async (post) => {
        const like = await prisma.like.findUnique({
          where: {
            userId_postId: {
              userId: req.user.id,
              postId: post.id,
            },
          },
        });

        return {
          ...post,
          isLiked: like !== null,
        };
      })
    );

    res.json(postsWithLikeStatus);
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
});

router.get(
  "/:postId",
  isLoggedIn,
  validatePostId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);

      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          replyTo: {
            select: {
              id: true,
              content: true,
              isReplyToDeleted: true,
              author: {
                select: {
                  username: true,
                  displayName: true,
                },
              },
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                },
              },
              _count: {
                select: {
                  likes: true,
                  replies: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
        },
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const like = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: req.user.id,
            postId: post.id,
          },
        },
      });

      res.json({
        ...post,
        isLiked: like !== null,
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  }
);

router.get(
  "/user/:userId",
  isLoggedIn,
  validateUserId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const currentUserId = req.user.id;

      const posts = await prisma.post.findMany({
        where: { authorId: userId },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
        },
      });

      const postsWithLikeStatus = await Promise.all(
        posts.map(async (post) => {
          const like = await prisma.like.findUnique({
            where: {
              userId_postId: {
                userId: currentUserId,
                postId: post.id,
              },
            },
          });

          return {
            ...post,
            isLiked: like !== null,
          };
        })
      );

      res.json(postsWithLikeStatus);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ error: "Failed to fetch user posts" });
    }
  }
);

router.delete(
  "/:postId",
  isLoggedIn,
  validatePostId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const userId = req.user.id;

      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (post.authorId !== userId) {
        return res
          .status(403)
          .json({ error: "You can only delete your own posts" });
      }

      await prisma.$transaction([
        prisma.post.updateMany({
          where: { replyToId: postId },
          data: { isReplyToDeleted: true },
        }),
        prisma.post.delete({
          where: { id: postId },
        }),
      ]);

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  }
);

router.post(
  "/:postId/like",
  isLoggedIn,
  validatePostId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const userId = req.user.id;

      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const like = await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });

      res.status(201).json(like);
    } catch (error) {
      if (error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR) {
        return res.status(400).json({ error: "You already liked this post" });
      }
      console.error("Error liking post:", error);
      res.status(500).json({ error: "Failed to like post" });
    }
  }
);

router.delete(
  "/:postId/like",
  isLoggedIn,
  validatePostId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const userId = req.user.id;

      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      res.status(204).send();
    } catch (error) {
      if (error.code === PRISMA_NOT_FOUND_ERROR) {
        return res.status(404).json({ error: "Like not found" });
      }
      console.error("Error unliking post:", error);
      res.status(500).json({ error: "Failed to unlike post" });
    }
  }
);

router.get("/explore", isLoggedIn, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      take: 50,
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching explore posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

export default router;
