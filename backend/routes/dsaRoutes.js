const express = require("express");
const router = express.Router();
const {
  getDSAQuestionsByDifficulty,
  runDSACode,
  submitDSATest,
  getLatestDSAAttempt,
} = require("../controllers/dsaController");

// Latest attempt
router.get("/latest-attempt", getLatestDSAAttempt);

// Run code against test cases
router.post("/run", runDSACode);

// Submit test
router.post("/submit", submitDSATest);

// Get questions by difficulty
router.get("/:difficulty", getDSAQuestionsByDifficulty);

module.exports = router;
