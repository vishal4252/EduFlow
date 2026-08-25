const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
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
