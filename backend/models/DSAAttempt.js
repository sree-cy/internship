const mongoose = require("mongoose");

const dsaAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
      lowercase: true,
      trim: true,
    },
    language: {
      type: String,
      default: "python",
    },
    selectedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DSAQuestion",
      },
    ],
    code: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    passedQuestions: {
      type: Number,
      default: 0,
    },
    failedQuestions: {
      type: Number,
      default: 0,
    },
    timeUsed: {
      type: String,
      default: "",
    },
    readinessAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "dsaAttempts",
  }
);

module.exports = mongoose.model("DSAAttempt", dsaAttemptSchema);
