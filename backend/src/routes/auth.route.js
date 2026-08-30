const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.loginUser);
router.get("/refresh-token", authController.refreshToken);
router.get("/logout", authController.logoutUser);
router.get("/logoutAll", authController.logoutAll);

module.exports = router;
