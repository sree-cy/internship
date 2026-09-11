const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    // User who submitted the code
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Coding question
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    // Programming language
    language: {
      type: String,
      required: true,
      enum: [
        "javascript",
        "python",
        "java",
        "cpp",
      ],
    },

    // User's submitted code
    code: {
      type: String,
      required: true,
    },

    // Result of code execution
    status: {
      type: String,
      required: true,
      enum: [
        "Pending",
        "Running",
        "Accepted",
        "Wrong Answer",
        "Runtime Error",
        "Compilation Error",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
      ],
      default: "Pending",
    },

    // Test case statistics
    testCasesPassed: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalTestCases: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Execution performance
    executionTime: {
      type: Number,
      default: 0,
      min: 0,
    },

    memoryUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Error information, if any
    errorMessage: {
      type: String,
      default: "",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Submission",
  submissionSchema
);
