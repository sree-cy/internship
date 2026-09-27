const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const User = require("./models/User");
const AptitudeQuestion = require("./models/AptitudeQuestion");
const AptitudeAttempt = require("./models/AptitudeAttempt");
const DSAQuestion = require("./models/DSAQuestion");
const DSAAttempt = require("./models/DSAAttempt");

const testDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully! 🌐");

    console.log("\nChecking PrepGo dedicated module models...\n");

    console.log("User collection:", User.collection.name);
    console.log("AptitudeQuestion collection:", AptitudeQuestion.collection.name);
    console.log("AptitudeAttempt collection:", AptitudeAttempt.collection.name);
    console.log("DSAQuestion collection:", DSAQuestion.collection.name);
    console.log("DSAAttempt collection:", DSAAttempt.collection.name);

    const counts = {
      users: await User.countDocuments(),
      aptitudeQuestions: await AptitudeQuestion.countDocuments(),
      aptitudeAttempts: await AptitudeAttempt.countDocuments(),
      dsaQuestions: await DSAQuestion.countDocuments(),
      dsaAttempts: await DSAAttempt.countDocuments(),
    };

    console.log("\nDocument counts:", counts);
    console.log("\nAll dedicated PrepGo models loaded and verified successfully! ✅");

    await mongoose.connection.close();
  } catch (error) {
    console.error("\nDatabase test failed:", error);
    process.exit(1);
  }
};

testDatabase();
