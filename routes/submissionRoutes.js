
import express from "express";

import {
  submitAssignment,
  getMySubmissions,
  getMyAssignmentSubmission,
  getAllSubmissions,
  reviewSubmission,
} from "../controllers/submissionController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// All submission routes require authentication.
router.use(protect);

// Student routes
router.post("/:assignmentId", submitAssignment);
router.get("/my-submissions", getMySubmissions);
router.get("/:assignmentId", getMyAssignmentSubmission);

// Instructor routes
router.get("/", adminOnly, getAllSubmissions);
router.patch("/:id/review", adminOnly, reviewSubmission);

export default router;
