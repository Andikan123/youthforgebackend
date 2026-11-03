
import express from "express";

import {
  getAssignments,
  getCourseAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAssignments);
router.get("/course/:courseId", getCourseAssignments);
router.get("/:id", getAssignment);

// Protected routes
router.post("/", protect, adminOnly, createAssignment);
router.put("/:id", protect, adminOnly, updateAssignment);
router.delete("/:id", protect, adminOnly, deleteAssignment);

export default router;
