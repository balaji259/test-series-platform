const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const TestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, enum: ["Physics", "Chemistry", "Math"], required: true },
  questions: [QuestionSchema],
  scheduledDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Test", TestSchema);
