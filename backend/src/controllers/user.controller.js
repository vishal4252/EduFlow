const userModel = require("../models/user.model");
const sessionModel = require("../models/session.model");

async function getAllTeachers(req, res) {
  try {
    const teachers = await userModel
      .find({ role: "teacher", isDeleted: false })
      .select("-password -createdAt -updatedAt -__v");
    res.status(200).json({
      success: true,
      message: "Teachers fetched successfully",
      data: teachers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching teachers",
      error: err.message,
    });
  }
}

async function getAllStudents(req, res) {
  try {
    const students = await userModel
      .find({ role: "student", isDeleted: false })
      .select("-password -createdAt -updatedAt -__v");
    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: err.message,
    });
  }
}

async function updateUserRole(req, res) {
  try {
    const userId = req.params.userId;
    const { role } = req.body;

    const validRoles = ["student", "teacher"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    const user = await userModel
      .findById(userId)
      .select("-password -createdAt -updatedAt -__v");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.role = role;
    await user.save();

    // Delete all sessions associated with the user when their role is updated
    await sessionModel.deleteMany({ user: user._id });

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: err.message,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Mark the user as deleted instead of removing from the database
    user.isDeleted = true;
    await user.save();

    // Delete all sessions associated with the user
    await sessionModel.deleteMany({ user: user._id });
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
}

module.exports = {
  getAllTeachers,
  getAllStudents,
  updateUserRole,
  deleteUser,
};
