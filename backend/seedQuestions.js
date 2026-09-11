const mongoose = require("mongoose");
require("dotenv").config();

const Question = require("./models/Question");
const TestCase = require("./models/TestCase");
const QuestionSet = require("./models/QuestionSet");

const seedQuestions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected! 🌐");

    // =====================================================
    // 1. CREATE MCQ QUESTION
    // =====================================================

    const mcqQuestion = await Question.findOneAndUpdate(
      {
        title: "Binary Search Time Complexity",
      },
      {
        round: "Round 1",
        category: "DSA",
        topic: "Arrays",
        subTopic: "Searching",
        type: "MCQ",
        difficulty: "Easy",

        title: "Binary Search Time Complexity",

        description:
          "What is the time complexity of binary search on a sorted array?",

        options: [
          "O(n)",
          "O(log n)",
          "O(n²)",
          "O(1)",
        ],

        // O(log n) is option 1
        correctAnswer: 1,

        explanation:
          "Binary search eliminates half of the search space after every comparison, resulting in O(log n) time complexity.",

        marks: 1,
        timeLimit: 60,

        tags: [
          "DSA",
          "Arrays",
          "Binary Search",
        ],

        isActive: true,
      },
      {
        new: true,
        upsert: true,
      }
    );

    console.log(
      "MCQ created:",
      mcqQuestion.title
    );

    // =====================================================
    // 2. CREATE CODING QUESTION
    // =====================================================

    const codingQuestion = await Question.findOneAndUpdate(
      {
        title: "Two Sum",
      },
      {
        round: "Round 1",
        category: "DSA",
        topic: "Arrays",
        subTopic: "Hashing",
        type: "Coding",
        difficulty: "Easy",

        title: "Two Sum",

        description:
          "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.",

        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation:
              "nums[0] + nums[1] = 2 + 7 = 9",
          },

          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            explanation:
              "nums[1] + nums[2] = 2 + 4 = 6",
          },
        ],

        constraints: [
          "2 <= nums.length <= 10000",
          "-1000000000 <= nums[i] <= 1000000000",
          "-1000000000 <= target <= 1000000000",
          "Exactly one valid answer exists.",
        ],

        inputFormat:
          "An integer array nums and an integer target.",

        outputFormat:
          "Return the indices of the two numbers that add up to target.",

        starterCode: {
          javascript:
            "function twoSum(nums, target) {\n  // Write your solution here\n}",

          python:
            "def two_sum(nums, target):\n    # Write your solution here\n    pass",

          java:
            "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",

          cpp:
            "#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n}",
        },

        allowedLanguages: [
          "javascript",
          "python",
          "java",
          "cpp",
        ],

        functionName: "twoSum",

        marks: 10,
        timeLimit: 120,

        tags: [
          "DSA",
          "Arrays",
          "Hashing",
          "Two Pointer",
        ],

        isActive: true,
      },
      {
        new: true,
        upsert: true,
      }
    );

    console.log(
      "Coding question created:",
      codingQuestion.title
    );

    // =====================================================
    // 3. CREATE TEST CASES FOR TWO SUM
    // =====================================================

    // Remove old test cases for this question
    await TestCase.deleteMany({
      questionId: codingQuestion._id,
    });

    await TestCase.insertMany([
      {
        questionId: codingQuestion._id,

        input:
          "nums = [2,7,11,15], target = 9",

        expectedOutput: "[0,1]",

        isPublic: true,

        order: 1,

        explanation:
          "2 + 7 = 9",
      },

      {
        questionId: codingQuestion._id,

        input:
          "nums = [3,2,4], target = 6",

        expectedOutput: "[1,2]",

        isPublic: true,

        order: 2,

        explanation:
          "2 + 4 = 6",
      },

      {
        questionId: codingQuestion._id,

        input:
          "nums = [3,3], target = 6",

        expectedOutput: "[0,1]",

        isPublic: false,

        order: 3,
      },

      {
        questionId: codingQuestion._id,

        input:
          "nums = [1,5,8,12], target = 13",

        expectedOutput: "[0,3]",

        isPublic: false,

        order: 4,
      },
    ]);

    console.log(
      "Test cases created for Two Sum ✅"
    );

    // =====================================================
    // 4. CREATE QUESTION SET
    // =====================================================

    const questionSet =
      await QuestionSet.findOneAndUpdate(
        {
          title: "DSA Beginner Practice",
        },
        {
          title: "DSA Beginner Practice",

          description:
            "A beginner-friendly DSA practice set containing MCQ and coding questions.",

          round: "Round 1",

          category: "DSA",

          questionIds: [
            mcqQuestion._id,
            codingQuestion._id,
          ],

          totalQuestions: 2,

          duration: 10,

          difficulty: "Easy",

          type: "Practice",

          isActive: true,
        },
        {
          new: true,
          upsert: true,
        }
      );

    console.log(
      "Question set created:",
      questionSet.title
    );

    // =====================================================
    // FINISHED
    // =====================================================

    console.log("\n================================");
    console.log("PrepGo seed completed! ✅");
    console.log("================================");

    console.log("\nCreated:");
    console.log("1. Binary Search MCQ");
    console.log("2. Two Sum Coding Problem");
    console.log("3. 4 Two Sum test cases");
    console.log("4. DSA Beginner Practice set");

    await mongoose.connection.close();

    console.log("\nMongoDB connection closed.");
  } catch (error) {
    console.error("\nSeed failed ❌");
    console.error(error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedQuestions();
