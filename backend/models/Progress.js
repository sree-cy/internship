const mongoose = require("mongoose");

const categoryProgressSchema = new mongoose.Schema(
  {
    questionsAttempted: {
      type: Number,
      default: 0,
      min: 0,
    },

    questionsCorrect: {
      type: Number,
      default: 0,
      min: 0,
    },

    questionsWrong: {
      type: Number,
      default: 0,
      min: 0,
    },

    codingProblemsAttempted: {
      type: Number,
      default: 0,
      min: 0,
    },

    codingProblemsSolved: {
      type: Number,
      default: 0,
      min: 0,
    },

    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    _id: false,
  }
);

const progressSchema = new mongoose.Schema(
  {
    // User whose progress this belongs to
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Round 1 — DSA
    round1: {
      type: categoryProgressSchema,
      default: () => ({}),
    },

    // Round 2 — Aptitude
    aptitude: {
      type: categoryProgressSchema,
      default: () => ({}),
    },

    // Round 2 — Reasoning
    reasoning: {
      type: categoryProgressSchema,
      default: () => ({}),
    },

    // Round 3 — Technical
    technical: {
      type: categoryProgressSchema,
      default: () => ({}),
    },

    // Overall preparation statistics
    overall: {
      questionsAttempted: {
        type: Number,
        default: 0,
        min: 0,
      },

      questionsCorrect: {
        type: Number,
        default: 0,
        min: 0,
      },

      codingProblemsAttempted: {
        type: Number,
        default: 0,
        min: 0,
      },

      codingProblemsSolved: {
        type: Number,
        default: 0,
        min: 0,
      },

      accuracy: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Progress",
  progressSchema
);
