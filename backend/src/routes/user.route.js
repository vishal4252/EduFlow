const express = require("express");
const router = express.Router();

const authMiddelware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const userController = require("../controllers/user.controller");

router.get(
  "/teachers",
  authMiddelware.authMiddleware,
  roleMiddleware.authorizeRole("admin"),
  userController.getAllTeachers,
);

router.get(
  "/students",
  authMiddelware.authMiddleware,
  roleMiddleware.authorizeRole("admin"),
  userController.getAllStudents,
);

router.put(
  "/:userId",
  authMiddelware.authMiddleware,
  roleMiddleware.authorizeRole("admin"),
  userController.updateUserRole,
);

router.delete(
  "/:userId",
  authMiddelware.authMiddleware,
  roleMiddleware.authorizeRole("admin"),
  userController.deleteUser,
);

module.exports = router;
