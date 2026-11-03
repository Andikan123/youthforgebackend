
import express from "express";

import {
  createNotification,
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin: Create notifications
router.post("/", protect, adminOnly, createNotification);

// Users: Retrieve notifications
router.get("/", protect, getMyNotifications);

// Users: Get unread notification count
router.get("/unread-count", protect, getUnreadCount);

// Users: Mark all notifications as read
router.patch("/read-all", protect, markAllAsRead);

// Users: Mark a specific notification as read
router.patch("/:id/read", protect, markAsRead);

// Users: Delete a notification
router.delete("/:id", protect, deleteNotification);

export default router;
