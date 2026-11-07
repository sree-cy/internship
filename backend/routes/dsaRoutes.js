const express = require("express");
const router = express.Router();
const {
  getDSAQuestionsByDifficulty,
  runDSACode,
  submitDSATest,
  getLatestDSAAttempt,
} = require("../controllers/dsaController");
const { optionalAuth } = require("../middleware/authMiddleware");
const { executionLimiter } = require("../middleware/rateLimiter");

// Latest attempt
router.get("/latest-attempt", optionalAuth, getLatestDSAAttempt);

// Run code against test cases (Rate limited to prevent execution floods)
router.post("/run", executionLimiter, runDSACode);

// Submit test
router.post("/submit", optionalAuth, submitDSATest);

// Get questions by difficulty
router.get("/:difficulty", getDSAQuestionsByDifficulty);

module.exports = router;
