const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      trim: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
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
