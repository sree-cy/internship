const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    // The coding question this test case belongs to
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    // Input given to the user's program
    input: {
      type: String,
      required: true,
    },

    // Expected output
    expectedOutput: {
      type: String,
      required: true,
    },

    // Public test cases are visible to the user.
    // Hidden test cases remain on the backend.
    isPublic: {
      type: Boolean,
      default: false,
    },

    // Controls the order in which test cases are executed
    order: {
      type: Number,
      default: 1,
    },

    // Optional explanation for public examples
    explanation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TestCase",
  testCaseSchema
);
