const express = require("express");

const {
  checkAnswer,
} = require("../controllers/answerController");

const router = express.Router();

router.post("/check", checkAnswer);

module.exports = router;
