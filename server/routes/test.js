const express = require("express");
const Test = require("../models/Test");
const Result=require("../models/Result");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Create Test (Only teachers)
router.post("/create", async (req, res) => {
  console.log(req.body);

  try {
    const { title, subject, scheduledDate, questions, createdBy } = req.body;
    
    if (!createdBy) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const test = new Test({
      title,
      subject,
      scheduledDate,
      questions,
      createdBy, // Use the userId from request body
    });

    await test.save();
    res.status(201).json({ message: "Test created successfully", test });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});


// Get all tests
router.get("/", async (req, res) => {
  try {
    const tests = await Test.find().populate("createdBy", "name email");
    console.log(tests);
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// router.post("/submit", async (req, res) => {
//   try {
//     const { testId, studentId, answers } = req.body;
//     console.log("Received data:", req.body);

//     // Validate request
//     if (!testId || !studentId || !answers || !Array.isArray(answers)) {
//       return res.status(400).json({ message: "Missing or invalid required fields" });
//     }

//     // Find the test
//     const test = await Test.findById(testId);
//     if (!test) {
//       console.log("Test not found");
//       return res.status(404).json({ message: "Test not found" });
//     }

//     let score = 0;
//     let processedAnswers = [];

//     // Validate answer length
//     if (answers.length !== test.questions.length) {
//       return res.status(400).json({ message: "Invalid number of answers" });
//     }

//     // Check each answer
//     answers.forEach((answer, index) => {
//       const question = test.questions[index];

//       // Validate that selectedOption is a string
//       if (typeof answer.selectedOption !== "string") {
//         return res.status(400).json({ message: "Invalid answer format" });
//       }

//       const correct = answer.selectedOption === question.correctAnswer; // Check correctness
//       if (correct) score++;

//       processedAnswers.push({
//         question: question.questionText,
//         selectedOption: answer.selectedOption,
//         correct,
//       });
//     });

//     // Save result
//     const result = new Result({
//       user: studentId,
//       test: testId,
//       score,
//       answers: processedAnswers,
//     });

//     await result.save();

//     console.log("✅ Test submitted successfully!");
//     res.status(200).json({ message: "Test submitted successfully", score });
//   } catch (error) {
//     console.error("❌ Error submitting test:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.post("/submit", async (req, res) => {
  try {
    const { testId, studentId, answers } = req.body;
    console.log("Received data:", req.body);

    // Validate request
    if (!testId || !studentId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Missing or invalid required fields" });
    }

    // 🔹 Check if the user has already submitted this test
    const existingResult = await Result.findOne({ test: testId, user: studentId });
    if (existingResult) {
      console.log("User has already submitted this test.");
      return res.status(400).json({ message: "Test already submitted", score: existingResult.score });
    }

    // Find the test
    const test = await Test.findById(testId);
    if (!test) {
      console.log("Test not found");
      return res.status(404).json({ message: "Test not found" });
    }

    let score = 0;
    let processedAnswers = [];

    // Validate answer length
    if (answers.length !== test.questions.length) {
      return res.status(400).json({ message: "Invalid number of answers" });
    }

    // Check each answer
    answers.forEach((answer, index) => {
      const question = test.questions[index];

      // Validate that selectedOption is a string
      if (typeof answer.selectedOption !== "string") {
        return res.status(400).json({ message: "Invalid answer format" });
      }

      const correct = answer.selectedOption === question.correctAnswer; // Check correctness
      if (correct) score++;

      processedAnswers.push({
        question: question.questionText,
        selectedOption: answer.selectedOption,
        correct,
      });
    });

    // Save result
    const result = new Result({
      user: studentId,
      test: testId,
      score,
      answers: processedAnswers,
    });

    await result.save();

    console.log("✅ Test submitted successfully!");
    res.status(200).json({ message: "Test submitted successfully", score });
  } catch (error) {
    console.error("❌ Error submitting test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
