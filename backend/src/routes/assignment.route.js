const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const assignmentController = require("../controllers/assignment.controller");
const router = express.Router();

router.post(
  "/courses/:courseId/assignment",
  authMiddleware.authMiddleware,
  roleMiddleware.authorizeRole("teacher"),
  assignmentController.createAssignment,
);

router.get(
  "/courses/:courseId/assignments",
  authMiddleware.authMiddleware,
  roleMiddleware.authorizeRole("admin", "teacher", "student"),
  assignmentController.getAssignment,
);

module.exports = router;
