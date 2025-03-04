const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
const url="mongodb+srv://balajipuneti259:testsimulator@testsimulator.emz4y.mongodb.net/";
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
