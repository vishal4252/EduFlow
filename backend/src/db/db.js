const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("DB connection error:", error);
    throw new Error("DB is not connected");
  }
}

module.exports = connectDB;
