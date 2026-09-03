const express = require("express");
const cookiesParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const authRouter = require("./routes/auth.route");
const courseRouter = require("./routes/course.router");
const enrollCourseRouter = require("./routes/enrollCourse.router");
const assignmentRouter = require("./routes/assignment.route");
const userRouter = require("./routes/user.route");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookiesParser());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduFlow API is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api", courseRouter);
app.use("/", enrollCourseRouter);
app.use("/", assignmentRouter);
app.use("/users", userRouter);

module.exports = app;
