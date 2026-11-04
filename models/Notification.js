
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "general",
    },

    link: {
      type: String,
      default: null,
    },

    // True for announcements sent to every student
    isGlobal: {
      type: Boolean,
      default: false,
    },

    // Personal notification read status
    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },

    // Students who have read a global announcement
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    // Students who have individually deleted a global announcement
    deletedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

export default Notification;
