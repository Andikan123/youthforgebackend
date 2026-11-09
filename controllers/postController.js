
import mongoose from "mongoose";
import Post from "../models/Post.js";

const postPopulation = [
  {
    path: "author",
    select: "firstName lastName email profileImage role",
  },
  {
    path: "comments.author",
    select: "firstName lastName profileImage role",
  },
];

// ======================================
// GET ALL POSTS
// ======================================

export const getPosts = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    const posts = await Post.find()
      .populate(postPopulation)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments();

    const formattedPosts = posts.map((post) => ({
      ...post,
      likes: post.likes.length,
      likedByMe: req.user
        ? post.likes.some(
            (id) => id.toString() === req.user._id.toString()
          )
        : false,
    }));

    res.status(200).json({
      success: true,
      posts: formattedPosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve posts.",
      error: error.message,
    });
  }
};

// ======================================
// CREATE POST
// ======================================

export const createPost = async (req, res) => {
  try {
    const { content, category } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required.",
      });
    }

    if (content.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Post cannot exceed 1000 characters.",
      });
    }

    const post = await Post.create({
      author: req.user._id,
      content: content.trim(),
      category: category || "Community post",
    });

    await post.populate(postPopulation);

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      post: {
        ...post.toObject(),
        likes: 0,
        likedByMe: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create post.",
      error: error.message,
    });
  }
};

// ======================================
// LIKE / UNLIKE POST
// ======================================

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID.",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const userId = req.user._id;

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.addToSet(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Post unliked." : "Post liked.",
      likes: post.likes.length,
      likedByMe: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update like.",
      error: error.message,
    });
  }
};

// ======================================
// ADD COMMENT
// ======================================

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID.",
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty.",
      });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 500 characters.",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    post.comments.push({
      author: req.user._id,
      text: text.trim(),
    });

    await post.save();
    await post.populate(postPopulation);

    const comment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      comment,
      commentsCount: post.comments.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add comment.",
      error: error.message,
    });
  }
};
