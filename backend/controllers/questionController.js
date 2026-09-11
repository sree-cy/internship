const Question = require("../models/Question");

// Get all active questions
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Get questions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
};


// Get a single question
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Get question error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch question",
    });
  }
};


// Filter questions
const getQuestionsByFilter = async (req, res) => {
  try {
    const {
      round,
      category,
      topic,
      difficulty,
      type,
    } = req.query;

    const filter = {
      isActive: true,
    };

    if (round) filter.round = round;
    if (category) filter.category = category;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Filter questions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to filter questions",
    });
  }
};


module.exports = {
  getQuestions,
  getQuestionById,
  getQuestionsByFilter,
};
