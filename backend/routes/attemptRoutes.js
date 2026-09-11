const express = require("express");

const {
  startAttempt,
  getAttemptById,
} = require("../controllers/attemptController");

const router = express.Router();


// Start practice
router.post(
  "/start",
  startAttempt
);


// Get attempt
router.get(
  "/:id",
  getAttemptById
);


module.exports = router;
