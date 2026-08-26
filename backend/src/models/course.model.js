const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Instructor is required"],
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  },
);

//Compound Index to ensure uniqueness of title, category, and instructor combination
courseSchema.index(
  {
    title: 1,
    category: 1,
    instructor: 1,
  },
  {
    unique: true,
  },
);

const courseModel = mongoose.model("course", courseSchema);

module.exports = courseModel;
