
import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getPosts,
  createPost,
  toggleLike,
  addComment,
} from "../controllers/postController.js";

const router = express.Router();

// Public: retrieve community posts
router.get("/", getPosts);

// Protected: create a post
router.post("/", protect, createPost);

// Protected: like or unlike a post
router.post("/:postId/like", protect, toggleLike);

// Protected: add a comment
router.post("/:postId/comments", protect, addComment);

export default router;
