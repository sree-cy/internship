const express = require("express");
const router = express.Router();
const {
  getQuestionsByDifficulty,
  submitAptitudeTest,
  getLatestAttempt,
} = require("../controllers/aptitudeController");
const { optionalAuth } = require("../middleware/authMiddleware");

// Latest attempt routes (Optional JWT binding)
router.get("/latest-attempt", optionalAuth, getLatestAttempt);
router.get("/attempts/latest", optionalAuth, getLatestAttempt);

// Submit test route (Optional JWT binding)
router.post("/submit", optionalAuth, submitAptitudeTest);

// Get questions by difficulty route
router.get("/:difficulty", getQuestionsByDifficulty);

module.exports = router;
