
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    type: {
      type: String,
      enum: [
        "announcement",
        "assignment",
        "course",
        "system",
      ],
      default: "system",
    },

    link: {
      type: String,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Efficiently retrieve a user's newest notifications.
notificationSchema.index({ recipient: 1, createdAt: -1 });

// Efficiently count unread notifications.
notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

export default Notification;
