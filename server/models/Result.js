const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  score: { type: Number, required: true },
  answers: [{ question: String, selectedOption: String, correct: Boolean }],
},{ timestamps: true });

module.exports = mongoose.model("Result", ResultSchema);
