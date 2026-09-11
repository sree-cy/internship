const QuestionSet = require("../models/QuestionSet");

// Get all active question sets
const getQuestionSets = async (req, res) => {
  try {
    const questionSets = await QuestionSet.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questionSets.length,
      questionSets,
    });
  } catch (error) {
    console.error("Get question sets error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch question sets",
    });
  }
};


// Get one question set
const getQuestionSetById = async (req, res) => {
  try {
    const questionSet = await QuestionSet.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("questionIds");

    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    res.status(200).json({
      success: true,
      questionSet,
    });
  } catch (error) {
    console.error("Get question set error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch question set",
    });
  }
};


module.exports = {
  getQuestionSets,
  getQuestionSetById,
};
