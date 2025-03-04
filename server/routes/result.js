const mongoose=require('mongoose');
const express = require("express");
const Result = require("../models/Result");
const Test = require("../models/Test");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
// Submit test result
router.post("/submit", async (req, res) => {
  try {
    const { testId, studentId, answers } = req.body;
    if (!testId || !studentId || !answers) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the user has already submitted this test
    const existingResult = await Result.findOne({ test: testId, user: studentId });
    console.log("existingResult");
    console.log(existingResult);
    if (existingResult) {
      return res.status(400).json({ message: "Test already submitted", score: existingResult.score });
    }

    // Find the test
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    // Calculate score
    let score = 0;
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctOption) {
        score++;
      }
    });

    // Save result to the database
    const result = new Result({ test: testId, user: studentId, score });
    await result.save();

    res.status(200).json({ message: "Test submitted successfully", score });
  } catch (error) {
    console.error("Error submitting test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/:testId/results/:userId", async (req, res) => {
  try {
    console.log("Request Params:", req.params);
    
    const { testId, userId } = req.params;

    // Convert to ObjectId
    const testObjectId = new mongoose.Types.ObjectId(testId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    console.log("Converted IDs:", testObjectId, userObjectId);

    const result = await Result.findOne({ test: testObjectId, user: userObjectId });

    console.log("Query Result:", result);

    if (!result) {
      return res.status(404).json({ message: "Result not found here" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Internal server error",error });
  }
});


// router.get("/getresults", async (req, res) => {
//   try {
//     // Fetch all results and populate user (to get name & email) and test (to get title)
//     const results = await Result.find()
//       .populate("user", "name email") // Fetch student name and email
//       .populate("test", "title") // Fetch test title
//       .sort({ createdAt: -1 }); // Sort by submission time (latest first)

//     // Group results by test
//     const groupedResults = {};
//     results.forEach(result => {
//       const testTitle = result.test.title;

//       if (!groupedResults[testTitle]) {
//         groupedResults[testTitle] = [];
//       }

//       groupedResults[testTitle].push({
//         studentName: result.user.name,
//         email: result.user.email,
//         score: result.score,
//         submittedAt: result.createdAt, // Fetch submission time
//       });
//     });

//     console.log("Grouped Results:", groupedResults);
//     res.status(200).json(groupedResults);
//   } catch (error) {
//     console.error("❌ Error fetching results:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.get("/getresults", async (req, res) => {
  try {
    // Fetch all results and populate user (to get name & email) and test (to get title)
    const results = await Result.find()
      .populate("user", "name email") // Fetch student name and email
      .populate("test", "title") // Fetch test title
      .select("user test score createdAt") // Explicitly include createdAt
      .sort({ createdAt: -1 }); // Sort by submission time (latest first)

    // Group results by test
    const groupedResults = {};
    results.forEach(result => {
      const testTitle = result.test?.title || "Unknown Test";

      if (!groupedResults[testTitle]) {
        groupedResults[testTitle] = [];
      }

      groupedResults[testTitle].push({
        studentName: result.user?.name || "Unknown",
        email: result.user?.email || "Unknown",
        score: result.score,
        submittedAt: result.createdAt || "N/A", // Handle missing timestamps
      });
    });

    console.log("Grouped Results:", groupedResults);
    res.status(200).json(groupedResults);
  } catch (error) {
    console.error("❌ Error fetching results:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;

