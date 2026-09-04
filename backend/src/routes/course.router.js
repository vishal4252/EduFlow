const express = require("express");
const router = express.Router();

const authMiddelware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const courseController = require("../controllers/course.controller");

router.post(
  "/courses",
  authMiddelware.authMiddleware,
  roleMiddleware.authorizeRole("admin"),
  courseController.createCourse,
);

router.patch(
  "/courses/:courseId",
  authMiddelware.authMiddleware,
  roleMiddleware.authorizeRole("admin"),
  courseController.updateInstructor,
);

router.put(
  "/courses/:courseId",
  authMiddelware.authMiddleware,
  roleMiddleware.authorizeRole("admin"),
  courseController.updateCourse,
);

router.delete(
  "/courses/:courseId",
  authMiddelware.authMiddleware,
  roleMiddleware.authorizeRole("admin"),
  courseController.deleteCourse,
);

router.get(
  "/courses",
  authMiddelware.authMiddleware,
  roleMiddleware.authorizeRole("admin", "teacher", "student"),
  courseController.getAllCourses,
);

router.get(
  "/courses/:courseId",
  authMiddelware.authMiddleware,
  roleMiddleware.authorizeRole("admin", "teacher", "student"),
  courseController.getCourseById,
);

module.exports = router;
