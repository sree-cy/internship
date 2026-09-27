const AptitudeQuestion = require("../models/AptitudeQuestion");
const AptitudeAttempt = require("../models/AptitudeAttempt");

// =========================================================================
// GET /api/aptitude/:difficulty
// Returns 20 questions for the specified difficulty without correct answers
// =========================================================================
const getQuestionsByDifficulty = async (req, res) => {
  try {
    const difficulty = req.params.difficulty.toLowerCase();

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level. Must be 'easy', 'medium', or 'hard'.",
      });
    }

    // Exclude correctAnswer so answers are not exposed on the client
    const questions = await AptitudeQuestion.find({ difficulty })
      .select("-correctAnswer")
      .limit(20);

    return res.status(200).json({
      success: true,
      count: questions.length,
      difficulty,
      questions,
    });
  } catch (error) {
    console.error("Error fetching aptitude questions:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching questions.",
      error: error.message,
    });
  }
};

// =========================================================================
// POST /api/aptitude/submit
// Evaluates submitted answers, calculates score & percentage, saves attempt
// =========================================================================
const submitAptitudeTest = async (req, res) => {
  try {
    const { difficulty, answers = {}, userId = null } = req.body;

    if (!difficulty || !["easy", "medium", "hard"].includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Valid difficulty level is required.",
      });
    }

    const diff = difficulty.toLowerCase();

    // Fetch the 20 questions including correctAnswer to grade
    const questions = await AptitudeQuestion.find({ difficulty: diff }).limit(20);

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this difficulty level.",
      });
    }

    let correct = 0;

    questions.forEach((q, index) => {
      // User can submit with question index ("0", "1", ...) or question _id
      const submittedAnswer = answers[index] !== undefined ? answers[index] : answers[q._id.toString()];
      if (submittedAnswer && submittedAnswer === q.correctAnswer) {
        correct++;
      }
    });

    const totalQuestions = questions.length;
    const wrong = totalQuestions - correct;
    const score = correct * 3; // 3 marks per question
    const maxScore = totalQuestions * 3;
    const percentage = Math.round((score / maxScore) * 100);

    // Save test attempt
    const attempt = await AptitudeAttempt.create({
      userId: userId || null,
      difficulty: diff,
      answers,
      score,
      percentage,
      completedAt: new Date(),
    });

    // Provide questions with answers so review component can verify answers
    const questionsWithAnswers = questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      answer: q.correctAnswer, // review page expects `q.answer`
      correctAnswer: q.correctAnswer,
      category: q.category,
    }));

    return res.status(200).json({
      success: true,
      score,
      correct,
      wrong,
      percentage,
      difficulty: diff,
      attemptId: attempt._id,
      questions: questionsWithAnswers,
      answers,
    });
  } catch (error) {
    console.error("Error evaluating test submission:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while evaluating test.",
      error: error.message,
    });
  }
};

// =========================================================================
// GET /api/aptitude/latest-attempt
// Retrieves the most recent aptitude attempt for the user or overall
// =========================================================================
const getLatestAttempt = async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};
    if (userId) {
      query.userId = userId;
    }

    // Try finding by user first if provided
    let latest = await AptitudeAttempt.findOne(query)
      .sort({ completedAt: -1, createdAt: -1 })
      .populate("userId", "name email");

    // If no attempt found for this specific user, fetch the latest attempt overall as fallback
    if (!latest && userId) {
      latest = await AptitudeAttempt.findOne({})
        .sort({ completedAt: -1, createdAt: -1 })
        .populate("userId", "name email");
    }

    return res.status(200).json({
      success: true,
      attempt: latest || null,
    });
  } catch (error) {
    console.error("Error fetching latest aptitude attempt:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching latest attempt.",
      error: error.message,
    });
  }
};

module.exports = {
  getQuestionsByDifficulty,
  submitAptitudeTest,
  getLatestAttempt,
};
