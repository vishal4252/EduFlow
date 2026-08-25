const mongoose = require("mongoose");
const userModel = require("../models/user.model");

async function validateInstructor(instructorId) {
  if (!mongoose.Types.ObjectId.isValid(instructorId)) {
    return {
      valid: false,
      status: 400,
      message: "Invalid Instructor ID",
    };
  }

  const instructor = await userModel.findOne({
    _id: instructorId,
    role: "teacher",
  });

  if (!instructor) {
    return {
      valid: false,
      status: 404,
      message: "Instructor not found",
    };
  }

  return {
    valid: true,
    instructor,
  };
}

module.exports = { validateInstructor };
