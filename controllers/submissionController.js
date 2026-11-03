
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";

// @desc    Submit an assignment
// @route   POST /api/submissions/:assignmentId
// @access  Student
export const submitAssignment = async (req, res) => {
  try {
    const { submissionText, projectLink } = req.body;

    const assignment = await Assignment.findOne({
      _id: req.params.assignmentId,
      isPublished: true,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // A submission must contain text, a project link or an uploaded file.
    const fileName = req.body.fileName || "";
    const fileUrl = req.body.fileUrl || "";

    if (!submissionText?.trim() && !projectLink?.trim() && !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide your assignment before submitting",
      });
    }

    // Find the student's previous submission, if one exists.
    let submission = await Submission.findOne({
      student: req.user._id,
      assignment: assignment._id,
    });

    if (submission) {
      // Update the existing submission.
      submission.submissionText = submissionText || "";
      submission.projectLink = projectLink || "";

      submission.file = {
        fileName,
        fileUrl,
        fileType: req.body.fileType || "",
      };

      // A resubmission must be reviewed again.
      submission.status = "submitted";
      submission.feedback = "";
      submission.score = null;
      submission.reviewedBy = null;
      submission.reviewedAt = null;
      submission.submittedAt = new Date();

      await submission.save();
    } else {
      // Create the student's first submission.
      submission = await Submission.create({
        student: req.user._id,
        assignment: assignment._id,
        submissionText: submissionText || "",
        projectLink: projectLink || "",
        file: {
          fileName,
          fileUrl,
          fileType: req.body.fileType || "",
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit assignment",
    });
  }
};

// @desc    Get all submissions belonging to the logged-in student
// @route   GET /api/submissions/my-submissions
// @access  Student
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      student: req.user._id,
    })
      .populate("assignment", "title weekNumber points")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve your submissions",
    });
  }
};

// @desc    Get one student's submission for an assignment
// @route   GET /api/submissions/:assignmentId
// @access  Student
export const getMyAssignmentSubmission = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      student: req.user._id,
      assignment: req.params.assignmentId,
    }).populate("assignment", "title weekNumber points");

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "You have not submitted this assignment yet",
      });
    }

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve submission",
    });
  }
};

// @desc    Get all student submissions for instructor review
// @route   GET /api/submissions
// @access  Admin
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("student", "firstName lastName email")
      .populate("assignment", "title weekNumber points")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve submissions",
    });
  }
};

// @desc    Review a student submission
// @route   PATCH /api/submissions/:id/review
// @access  Admin
export const reviewSubmission = async (req, res) => {
  try {
    const { status, feedback, score } = req.body;

    const allowedStatuses = ["approved", "revision_required"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Choose approved or revision_required",
      });
    }

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (
      score !== undefined &&
      (
        !Number.isFinite(Number(score)) ||
        Number(score) < 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Score must be a valid non-negative number",
      });
    }

    submission.status = status;
    submission.feedback = feedback || "";
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();

    if (score !== undefined) {
      submission.score = Number(score);
    }

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Submission reviewed successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to review submission",
    });
  }
};
