const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://f12niyamparekh:niyam24parekh@cluster0.4x3ob.mongodb.net/"
    );
    console.log("Connected to MongoDB...");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;
