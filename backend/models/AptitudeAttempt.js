const mongoose = require("mongoose");

const aptitudeAttemptSchema = new mongoose.Schema(
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
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    percentage: {
      type: Number,
      required: true,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AptitudeAttempt", aptitudeAttemptSchema);
