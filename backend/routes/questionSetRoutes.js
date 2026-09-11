const express = require("express");

const {
  getQuestionSets,
  getQuestionSetById,
} = require("../controllers/questionSetController");

const router = express.Router();


// Get all question sets
router.get("/", getQuestionSets);


// Get one question set
router.get("/:id", getQuestionSetById);


module.exports = router;
