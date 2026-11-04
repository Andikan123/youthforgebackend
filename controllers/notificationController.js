
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// @desc Create a notification
// @route POST /api/notifications
// @access Admin
export const createNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      link,
      recipientId,
      sendToAll,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    let notification;

    const isGlobal =
      sendToAll === true || sendToAll === "true";

    if (isGlobal) {
      // Store one announcement for all current and future students
      notification = await Notification.create({
        title,
        message,
        type,
        link,
        isGlobal: true,
        createdBy: req.user._id,
      });
    } else {
      if (!recipientId) {
        return res.status(400).json({
          success: false,
          message: "Recipient ID is required",
        });
      }

      const recipient = await User.findOne({
        _id: recipientId,
        isActive: true,
      });

      if (!recipient) {
        return res.status(404).json({
          success: false,
          message: "Recipient not found",
        });
      }

      notification = await Notification.create({
        recipient: recipientId,
        title,
        message,
        type,
        link,
        isGlobal: false,
        createdBy: req.user._id,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      count: 1,
      notification,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Get logged-in user's notifications
// @route GET /api/notifications
// @access Private
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      $and: [
        {
          $or: [
            { isGlobal: true },
            { recipient: userId },
          ],
        },
        {
          deletedBy: { $ne: userId },
        },
      ],
    }).sort({ createdAt: -1 });

    // Attach the current user's read status to each notification
    const formattedNotifications = notifications.map(
      (notification) => {
        const item = notification.toObject();

        if (item.isGlobal) {
          item.isRead = item.readBy.some(
            (id) => id.toString() === userId.toString()
          );
        }

        return item;
      }
    );

    return res.status(200).json({
      success: true,
      count: formattedNotifications.length,
      notifications: formattedNotifications,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Get unread notification count
// @route GET /api/notifications/unread-count
// @access Private
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
      $or: [
        {
          isGlobal: true,
          readBy: { $ne: userId },
          deletedBy: { $ne: userId },
        },
        {
          recipient: userId,
          isRead: false,
          isGlobal: false,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      unreadCount: count,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Mark one notification as read
// @route PATCH /api/notifications/:id/read
// @access Private
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const notification = await Notification.findOne({
      _id: req.params.id,
      $or: [
        { isGlobal: true },
        { recipient: userId },
      ],
      deletedBy: { $ne: userId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.isGlobal) {
      await Notification.updateOne(
        { _id: notification._id },
        {
          $addToSet: { readBy: userId },
        }
      );
    } else {
      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Mark all notifications as read
// @route PATCH /api/notifications/read-all
// @access Private
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    // Mark personal notifications as read
    await Notification.updateMany(
      {
        recipient: userId,
        isGlobal: false,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    // Mark global announcements as read for this student only
    await Notification.updateMany(
      {
        isGlobal: true,
        readBy: { $ne: userId },
        deletedBy: { $ne: userId },
      },
      {
        $addToSet: {
          readBy: userId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Delete a notification for the logged-in user
// @route DELETE /api/notifications/:id
// @access Private
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;

    const notification = await Notification.findOne({
      _id: req.params.id,
      $or: [
        { isGlobal: true },
        { recipient: userId },
      ],
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.isGlobal) {
      // Hide it only for this student
      await Notification.updateOne(
        { _id: notification._id },
        {
          $addToSet: {
            deletedBy: userId,
          },
        }
      );
    } else {
      // Personal notification can be deleted normally
      await Notification.deleteOne({
        _id: notification._id,
        recipient: userId,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
