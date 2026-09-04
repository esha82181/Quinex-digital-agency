// =========================================================
// MongoDB connection setup using Mongoose
// Reads the connection string from .env — never hard-coded
// =========================================================
const mongoose = require('mongoose');
 
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // stop the server if DB connection fails
  }
};
 
module.exports = connectDB;
 