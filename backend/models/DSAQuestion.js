const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: "" },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
  },
  { _id: false }
);

const dsaQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
      lowercase: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    examples: [exampleSchema],
    constraints: [String],
    starterCode: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    solution: {
      type: mongoose.Schema.Types.Mixed,
    },
    marks: {
      type: Number,
      default: 30,
    },
    testCases: [testCaseSchema],
    hints: [String],
  },
  {
    timestamps: true,
    collection: "dsaQuestions",
  }
);

module.exports = mongoose.model("DSAQuestion", dsaQuestionSchema);
