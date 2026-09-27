const mongoose = require("mongoose");

const aptitudeQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length === 4;
        },
        message: "Question must have exactly 4 options",
      },
    },
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["quantitative", "logical", "verbal"],
      lowercase: true,
      trim: true,
    },
    marks: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AptitudeQuestion", aptitudeQuestionSchema);
