const mongoose = require("mongoose");

const questionSetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    round: {
      type: String,
      required: true,
      enum: ["Round 1", "Round 2", "Round 3"],
    },

    category: {
      type: String,
      required: true,
      enum: [
        "DSA",
        "Aptitude",
        "Reasoning",
        "Technical",
      ],
    },

    // Questions included in this practice set
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Duration in minutes
    duration: {
      type: Number,
      default: 30,
      min: 1,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Mixed"],
      default: "Mixed",
    },

    type: {
      type: String,
      enum: [
        "Practice",
        "Mock Test",
        "Interview",
      ],
      default: "Practice",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "QuestionSet",
  questionSetSchema
);
