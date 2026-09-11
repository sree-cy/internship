const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from bookmarking
// the same question multiple times.
bookmarkSchema.index(
  { userId: 1, questionId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Bookmark",
  bookmarkSchema
);
