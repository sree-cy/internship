const Attempt = require("../models/Attempt");
const QuestionSet = require("../models/QuestionSet");


// Start a new practice attempt
const startAttempt = async (req, res) => {
  try {
    const {
      userId,
      questionSetId,
    } = req.body;

    if (!userId || !questionSetId) {
      return res.status(400).json({
        success: false,
        message: "userId and questionSetId are required",
      });
    }

    const questionSet = await QuestionSet.findById(
      questionSetId
    );

    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    const attempt = await Attempt.create({
      userId,
      questionSetId,

      round: questionSet.round,

      category: questionSet.category,

      totalQuestions:
        questionSet.questionIds.length,

      attemptedQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      skippedQuestions: 0,

      score: 0,
      accuracy: 0,

      timeTaken: 0,

      status: "In Progress",

      startedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Attempt started successfully",
      attempt,
    });

  } catch (error) {

    console.error(
      "Start attempt error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to start attempt",
    });
  }
};


// Get an attempt
const getAttemptById = async (req, res) => {
  try {

    const attempt = await Attempt.findById(
      req.params.id
    )
      .populate("questionSetId")
      .populate("userId");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    res.status(200).json({
      success: true,
      attempt,
    });

  } catch (error) {

    console.error(
      "Get attempt error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch attempt",
    });
  }
};


module.exports = {
  startAttempt,
  getAttemptById,
};
