
import Assignment from "../models/Assignment.js";
import Course from "../models/Course.js";

// @desc    Get all published assignments
// @route   GET /api/assignments
// @access  Public
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      isPublished: true,
    })
      .populate("course", "title")
      .sort({ weekNumber: 1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve assignments",
    });
  }
};

// @desc    Get assignments for a specific course
// @route   GET /api/assignments/course/:courseId
// @access  Public
export const getCourseAssignments = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      isPublished: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const assignments = await Assignment.find({
      course: course._id,
      isPublished: true,
    }).sort({ weekNumber: 1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve course assignments",
    });
  }
};

// @desc    Get one assignment
// @route   GET /api/assignments/:id
// @access  Public
export const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      isPublished: true,
    }).populate("course", "title");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve assignment",
    });
  }
};

// @desc    Create an assignment
// @route   POST /api/assignments
// @access  Admin (we will add admin protection in the routes)
export const createAssignment = async (req, res) => {
  try {
    const {
      course,
      weekNumber,
      title,
      description,
      instructions,
      dueDate,
      points,
      isPublished,
    } = req.body;

    if (!course || !weekNumber || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Course, week number, title and description are required",
      });
    }

    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const assignment = await Assignment.create({
      course,
      weekNumber,
      title,
      description,
      instructions,
      dueDate,
      points,
      isPublished,
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create assignment",
    });
  }
};

// @desc    Update an assignment
// @route   PUT /api/assignments/:id
// @access  Admin (we will add admin protection in the routes)
export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const allowedFields = [
      "weekNumber",
      "title",
      "description",
      "instructions",
      "dueDate",
      "points",
      "isPublished",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        assignment[field] = req.body[field];
      }
    });

    await assignment.save();

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update assignment",
    });
  }
};

// @desc    Delete an assignment
// @route   DELETE /api/assignments/:id
// @access  Admin (we will add admin protection in the routes)
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    await assignment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete assignment",
    });
  }
};
