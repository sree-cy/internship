const express = require("express");
const router = express.Router();
const {
  getQuestionsByDifficulty,
  submitAptitudeTest,
  getLatestAttempt,
} = require("../controllers/aptitudeController");

// Latest attempt routes
router.get("/latest-attempt", getLatestAttempt);
router.get("/attempts/latest", getLatestAttempt);

// Submit test route
router.post("/submit", submitAptitudeTest);

// Get questions by difficulty route
router.get("/:difficulty", getQuestionsByDifficulty);

module.exports = router;
