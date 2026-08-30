const mongoose = require("mongoose");
const courseModel = require("../models/course.model");
const { validateInstructor } = require("../services/course.service");

async function createCourse(req, res) {
  try {
    const { title, description, category, instructor } = req.body;
    const isCourseAlreadyExist = await courseModel.findOne({
      title,
      category,
    });

    if (isCourseAlreadyExist) {
      return res.status(400).json({
        message: "Course Already Exists",
      });
    }

    const result = await validateInstructor(instructor);
    if (!result.valid) {
      res.status(result.status).json({
        message: result.message,
      });
    }

    const course = await courseModel.create({
      title,
      description,
      category,
      instructor,
    });
    res.status(201).json({
      message: "Course Created Successfully",
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        instructor: course.instructor,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function updateCourse(req, res) {
  try {
    const { title, description, category, instructor } = req.body;
    const courseId = req.params.courseId;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: "Invalid Course Id",
      });
    }

    if (!title || !description || !category || !instructor) {
      return res.status(400).json({
        message: "All course fields are required",
      });
    }

    const result = await validateInstructor(instructor);
    if (!result.valid) {
      return res.status(result.status).json({
        message: result.message,
      });
    }

    const isCourseExists = await courseModel.findOne({
      title,
      category,
      instructor,
      _id: { $ne: courseId },
    });
    if (isCourseExists) {
      return res.status(409).json({
        message: "Course Already Exists",
      });
    }
    const course = await courseModel.findOneAndReplace(
      { _id: courseId },
      {
        title,
        description,
        category,
        instructor,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course Updated Successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function updateInstructor(req, res) {
  try {
    const courseId = req.params.courseId;
    const { instructor } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: "Invalid Course Id",
      });
    }
    if (!instructor) {
      return res.status(400).json({
        message: "Instructor id required",
      });
    }

    const result = await validateInstructor(instructor);
    if (!result.valid) {
      return res.status(result.status).json({
        message: result.message,
      });
    }

    const course = await courseModel.findByIdAndUpdate(
      courseId,
      { instructor },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: "Instructor updated successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function getAllCourses(req, res) {
  try {
    const courses = await courseModel
      .find()
      .populate("instructor students", "username email");
    res.status(200).json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function getCourseById(req, res) {
  try {
    const courseId = req.params.courseId;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: "Invalid Course Id",
      });
    }
    const course = await courseModel
      .findById(courseId)
      .select("-createdAt -updatedAt -students")
      .populate("instructor", "username email -_id");

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    res.status(200).json({
      message: "Course fetched successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  createCourse,
  updateCourse,
  updateInstructor,
  getAllCourses,
  getCourseById,
};
