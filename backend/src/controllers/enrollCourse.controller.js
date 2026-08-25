const mongoose = require("mongoose");
const courseModel = require("../models/course.model");

async function enrollStudent(req, res) {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: "Invalid Course ID",
      });
    }

    const course = await courseModel.findById({ _id: courseId });
    if (!course) {
      return res.status(404).json({
        message: "Course Not Found",
      });
    }

    /*
    some() check all the students ids to see if the student is already enrolled in the course
    it is similar to map function it goes through each element,
    but it returns true or false if the student is already enrolled in the course
    */
    const isStudentEnrolled = course.students.some(
      (id) => id.toString() === studentId,
    );
    if (isStudentEnrolled) {
      return res.status(409).json({
        message: "Student Already Enrolled",
      });
    }

    const enrollStudent = await courseModel.findOneAndUpdate(
      { _id: courseId },
      { $addToSet: { students: studentId } },
      { new: true },
    );
    res.status(201).json({
      message: "Student Enrolled SuccessFully",
      enrollStudent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function getEnrolledCourses(req, res) {
  try {
    const studentId = req.user.id;

    const enrolledCourses = await courseModel
      .find({
        students: studentId,
      })
      .select("-createdAt -updatedAt -students")
      .populate("instructor", "username email -_id");

    if (!enrolledCourses.length === 0) {
      return res.status(404).json({
        message: "No Enroll Course Found",
        enrolledCourses: [],
      });
    }

    res.status(200).json({
      message: "Enrolled Course Fetch Successfully",
      enrolledCourses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = { enrollStudent, getEnrolledCourses };
