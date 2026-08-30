const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid or Expired Access Token",
    });
  }
}

module.exports = { authMiddleware };
