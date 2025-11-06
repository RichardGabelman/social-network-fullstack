import express from "express";
import prisma from "../db/prisma.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

const validatePost = [
  body('content')
    .trim()
    .notEmpty().withMessage('Post content is required')
    .isLength({ max: 500 }).withMessage('Post content must be 500 characters or less'),
  body('replyToId')
    .optional()
    .isInt().withMessage('Reply ID must be a valid integer')
];

const validatePostId = [
  param('postId')
    .isInt().withMessage('Post ID must be a valid integer')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post("/", isLoggedIn, validatePost, handleValidationErrors, async (req, res) => {
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
    });

    res.status(201).json(post);
  } catch (error) {
    console.log("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

export default router;