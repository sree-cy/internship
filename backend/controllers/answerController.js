const Question = require("../models/Question");

const checkAnswer = async (req, res) => {
  try {
    const { questionId, selectedAnswer } = req.body;

    // Check required data
    if (!questionId || selectedAnswer === undefined) {
      return res.status(400).json({
        success: false,
        message: "Question ID and selected answer are required",
      });
    }

    // Find question
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Check answer
    const isCorrect =
      Number(selectedAnswer) === Number(question.correctAnswer);

    return res.status(200).json({
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
    });

  } catch (error) {
    console.error("CHECK ANSWER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  checkAnswer,
};
