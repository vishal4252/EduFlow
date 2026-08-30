const userModel = require("../models/user.model");
const sessionModel = require("../models/session.model");
const otpModel = require("../models/otp.model");
const { sendEmail } = require("../services/email.service");
const { generateOtp, generateOtpHtml } = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;
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
      role: "student",
    });

    const opt = generateOtp();
    const optHtml = generateOtpHtml(opt);
    const optHash = await bcrypt.hash(opt, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    await otpModel.create({
      email,
      user: user._id,
      otp: optHash,
      expiresAt,
    });

    await sendEmail(
      email,
      "OTP Verification for EduFlow",
      `Your OTP code is ${opt}`,
      optHtml,
    );

    res.status(201).json({
      message: "User Register Successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function verifyEmail(req, res) {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User Email Not Found",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "Email Already Verified",
      });
    }

    const otpRecord = await otpModel.findOne({ email, user: user._id });
    if (!otpRecord) {
      return res.status(404).json({
        message: "OTP Not Found",
      });
    }
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpValid) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.verified = true;
    await user.save();

    await otpModel.deleteMany({ email, user: user._id });

    res.status(200).json({
      message: "Email Verified Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
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
        message: "Invalid Credential or User Not Found",
      });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    if (!user.verified) {
      return res.status(401).json({
        message: "Email Not Verified",
      });
    }

    // We use (new sessionModel()) This creates a new temporary session of the user without refreshToken but not yet saved to the database.
    // The refreshToken will be generated and saved in the next steps.
    const session = new sessionModel({
      user: user.id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        sessionId: session._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    session.refreshToken = await bcrypt.hash(refreshToken, 10);
    await session.save();
    // Here the session is saved to the database with the hashed refreshToken.

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        sessionId: session._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //or secure: true
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //or sameSite: "strict" or sameSite: "none" (if you want to allow cross-site cookies)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth", // Set the path for the refresh token cookie
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //or secure: true
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //or sameSite: "strict" or sameSite: "none" (if you want to allow cross-site cookies)
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
      message: "Login Successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
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

    const session = await sessionModel.findOne({
      _id: decoded.sessionId,
      revoked: false,
    });
    if (!session) {
      return res.status(401).json({
        message: "Session Not Found or Revoked",
      });
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      session.refreshToken,
    );
    if (!isRefreshTokenValid) {
      return res.status(401).json({
        message: "Invalid Refresh Token",
      });
    }

    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
        sessionId: session._id,
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
        sessionId: session._id,
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
      path: "/api/auth", // Set the path for the refresh token cookie
    });

    session.refreshToken = await bcrypt.hash(newRefreshToken, 10);
    await session.save();

    res.status(200).json({
      message: "Token Refreshed Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid or Expired Refresh Token",
    });
  }
}

async function logoutUser(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh Token Not Found",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const session = await sessionModel.findOne({
      _id: decoded.sessionId,
      revoked: false,
    });
    if (!session) {
      return res.status(401).json({
        message: "Session Not Found or Revoked",
      });
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      session.refreshToken,
    );
    if (!isRefreshTokenValid) {
      return res.status(401).json({
        message: "Invalid Refresh Token",
      });
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/auth" });
    return res.status(200).json({
      message: "Logout Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid or Expired Refresh Token",
    });
  }
}

async function logoutAll(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh Token Not Found",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log(decoded);
    await sessionModel.updateMany(
      {
        user: decoded.id,
        revoked: false,
      },
      {
        revoked: true,
      },
    );

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/auth" });
    res.status(200).json({
      message: "Logout All Devices Successfully",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Refresh Token",
    });
  }
}

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  refreshToken,
  logoutUser,
  logoutAll,
};
