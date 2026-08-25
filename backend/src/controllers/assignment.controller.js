const mongoose = require("mongoose");
const courseModel = require("../models/course.model");
const assignmentModel = require("../models/assignment.model");

async function createAssignment(req, res) {
  try {
    const { courseId } = req.params;
    const instructorId = req.user.id;
    const { title, description, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const courseInstructorId = course.instructor.toString();
    if (courseInstructorId !== instructorId) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to create an assignment for this course",
      });
    }

    const isAssignmentExists = await assignmentModel.findOne({
      title,
      course: courseId,
      instructor: instructorId,
    });

    if (isAssignmentExists) {
      return res.status(409).json({
        success: false,
        message: "An assignment with this title already exists for this course",
      });
    }

    const assignment = await assignmentModel.create({
      title,
      description,
      course: courseId,
      instructor: instructorId,
      dueDate,
    });
    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getAssignment(req, res) {
  try {
    const { courseId } = req.params;
    const { id, role } = req.user;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (role === "teacher") {
      const courseInstructorId = course.instructor.toString();
      if (courseInstructorId !== id) {
        return res.status(403).json({
          success: false,
          message: "You dont have access of this course",
        });
      }
    } else if (role === "student") {
      const isStudentEnrolled = course.students.some(
        (studentIds) => studentIds.toString() === id,
      );
      if (!isStudentEnrolled) {
        return res.status(403).json({
          success: false,
          message: "You are not enrolled in this course",
        });
      }
    }

    const assignments = await assignmentModel
      .find({
        course: courseId,
      })
      .populate("course", "title description")
      .populate("instructor", "username email");

    return res.status(200).json({
      success: true,
      message: "Assignments retrieved successfully",
      assignments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { createAssignment, getAssignment };
