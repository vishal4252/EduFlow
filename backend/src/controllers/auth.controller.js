const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
  try {
    const { username, email, password, role = "student" } = req.body;
    const isUserAlreadyRegister = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyRegister) {
      return res.status(409).json({
        message: "Already Registered",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
      role,
    });

    res.status(201).json({
      message: "User Register Successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Credential",
      });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //or secure: true
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //or sameSite: "strict" or sameSite: "none" (if you want to allow cross-site cookies)
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //or secure: true
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //or sameSite: "strict" or sameSite: "none" (if you want to allow cross-site cookies)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth/refresh-token", // Set the path for the refresh token cookie
    });

    res.status(200).json({
      message: "Login Successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //or secure: true
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //or sameSite: "strict" or sameSite: "none" (if you want to allow cross-site cookies)
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //or secure: true
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //or sameSite: "strict" or sameSite: "none" (if you want to allow cross-site cookies)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth/refresh-token", // Set the path for the refresh token cookie
    });

    res.status(200).json({
      message: "Token Refreshed Successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Invalid or Expired Refresh Token",
    });
  }
}

async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout Successfully",
  });
}

module.exports = { registerUser, loginUser, refreshToken, logoutUser };
