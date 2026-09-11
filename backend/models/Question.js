const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
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

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    subTopic: {
      type: String,
      default: "",
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["MCQ", "Coding"],
      default: "MCQ",
    },

    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    // MCQ
    options: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: Number,
      required: function () {
        return this.type === "MCQ";
      },
    },

    explanation: {
      type: String,
      default: "",
    },

    // Coding
    examples: {
      type: [
        {
          input: String,
          output: String,
          explanation: String,
        },
      ],
      default: [],
    },

    constraints: {
      type: [String],
      default: [],
    },

    inputFormat: {
      type: String,
      default: "",
    },

    outputFormat: {
      type: String,
      default: "",
    },

    starterCode: {
      javascript: {
        type: String,
        default: "",
      },

      python: {
        type: String,
        default: "",
      },

      java: {
        type: String,
        default: "",
      },

      cpp: {
        type: String,
        default: "",
      },
    },

    allowedLanguages: {
      type: [String],
      default: [
        "javascript",
        "python",
        "java",
        "cpp",
      ],
    },

    functionName: {
      type: String,
      default: "",
    },

    marks: {
      type: Number,
      default: 1,
      min: 1,
    },

    timeLimit: {
      type: Number,
      default: 60,
    },

    tags: {
      type: [String],
      default: [],
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
  "Question",
  questionSchema
);
