const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const enrollCourse = require("../controllers/enrollCourse.controller");
const router = express.Router();

router.post(
  "/courses/:courseId/enroll",
  authMiddleware.authMiddleware,
  roleMiddleware.authorizeRole("student"),
  enrollCourse.enrollStudent,
);

router.get(
  "/courses/my-courses",
  authMiddleware.authMiddleware,
  roleMiddleware.authorizeRole("student"),
  enrollCourse.getEnrolledCourses,
);
module.exports = router;
