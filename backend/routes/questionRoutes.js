const express = require("express");

const {
  getQuestions,
  getQuestionById,
  getQuestionsByFilter,
} = require("../controllers/questionController");

const router = express.Router();


// Get all questions
router.get("/", getQuestions);


// Get questions using filters
router.get("/filter", getQuestionsByFilter);


// Get one question
router.get("/:id", getQuestionById);


module.exports = router;
