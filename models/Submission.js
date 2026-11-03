
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    submissionText: {
      type: String,
      trim: true,
      default: "",
    },

    projectLink: {
      type: String,
      trim: true,
      default: "",
    },

    file: {
      fileName: {
        type: String,
        default: "",
      },
      fileUrl: {
        type: String,
        default: "",
      },
      fileType: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: ["submitted", "under_review", "approved", "revision_required"],
      default: "submitted",
    },

    feedback: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      min: 0,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate submission documents for the same student and assignment.
// Students can update their existing submission instead.
submissionSchema.index(
  { student: 1, assignment: 1 },
  { unique: true }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
