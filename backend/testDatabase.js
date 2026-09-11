const mongoose = require("mongoose");

require("dotenv").config();

const User = require("./models/User");
const Question = require("./models/Question");
const TestCase = require("./models/TestCase");
const QuestionSet = require("./models/QuestionSet");
const Attempt = require("./models/Attempt");
const Answer = require("./models/Answer");
const Submission = require("./models/Submission");
const Progress = require("./models/Progress");
const Bookmark = require("./models/Bookmark");
const UserSettings = require("./models/UserSettings");
const Feedback = require("./models/Feedback");

const testDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    console.log("\nChecking PrepGo models...\n");

    console.log(
      "User collection:",
      User.collection.name
    );

    console.log(
      "Question collection:",
      Question.collection.name
    );

    console.log(
      "TestCase collection:",
      TestCase.collection.name
    );

    console.log(
      "QuestionSet collection:",
      QuestionSet.collection.name
    );

    console.log(
      "Attempt collection:",
      Attempt.collection.name
    );

    console.log(
      "Answer collection:",
      Answer.collection.name
    );

    console.log(
      "Submission collection:",
      Submission.collection.name
    );

    console.log(
      "Progress collection:",
      Progress.collection.name
    );

    console.log(
      "Bookmark collection:",
      Bookmark.collection.name
    );

    console.log(
      "UserSettings collection:",
      UserSettings.collection.name
    );

    console.log(
      "Feedback collection:",
      Feedback.collection.name
    );

    console.log(
      "\nAll PrepGo models loaded successfully! ✅"
    );

    await mongoose.connection.close();

  } catch (error) {

    console.error(
      "\nDatabase test failed:"
    );

    console.error(error);

    process.exit(1);
  }
};

testDatabase();
