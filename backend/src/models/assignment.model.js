const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: [true, "Course is required"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Instructor is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
  },
);

assignmentSchema.index(
  {
    title: 1,
    course: 1,
    instructor: 1,
  },
  {
    unique: true,
  },
);

const assignmentModel = mongoose.model("assignment", assignmentSchema);

module.exports = assignmentModel;
