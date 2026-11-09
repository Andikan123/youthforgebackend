
import express from "express";

import {
  registerUser,
  loginUser,
  getMyProfile,
  updateMe,
  uploadProfileImage,
  getCommunityUsers,
} from "../controllers/userControllers.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
// Public community route
router.get("/community", getCommunityUsers);

// Protected routes
router.get("/me", protect, getMyProfile);
router.patch("/me", protect, updateMe);

// Profile picture upload
router.patch(
  "/me/profile-image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);

export default router;
