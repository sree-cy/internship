const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    // User who took the test
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Practice/test that was attempted
    questionSetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionSet",
      required: true,
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

    // Question statistics
    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    attemptedQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
      min: 0,
    },

    wrongAnswers: {
      type: Number,
      default: 0,
    },

    skippedQuestions: {
      type: Number,
      default: 0,
    },

    // Final score
    score: {
      type: Number,
      default: 0,
    },

    // Percentage
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Total time spent in seconds
    timeTaken: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "In Progress",
        "Completed",
        "Abandoned",
      ],
      default: "In Progress",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Attempt",
  attemptSchema
);
