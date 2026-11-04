
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  provider: {
    type: String,
    default: "W3Schools",
  },

  url: {
    type: String,
    default: null,
  },
});

const weekSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },

  subject: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },
  isLocked: {
  type: Boolean,
  default: true,
},

  description: {
    type: String,
    required: true,
  },

  topics: [{
    type: String,
  }],

  material: {
    type: String,
    required: true,
  },

  resources: [resourceSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      default: "Beginner",
    },

    duration: {
      type: String,
      default: "8 weeks",
    },

    weeks: [weekSchema],

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
