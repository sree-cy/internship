const { spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const DSAQuestion = require("../models/DSAQuestion");
const DSAAttempt = require("../models/DSAAttempt");

// =========================================================================
// OUTPUT NORMALIZATION & COMPARISON
// =========================================================================
function areOutputsEquivalent(actual, expected) {
  if (actual === expected) return true;
  if (!actual && !expected) return true;
  if (!actual || !expected) return false;

  const a = String(actual).trim();
  const e = String(expected).trim();
  if (a === e) return true;
  if (a.toLowerCase() === e.toLowerCase()) return true;

  // Normalize by removing brackets, commas, quotes, parentheses and normalizing whitespace
  const strip = (val) =>
    val
      .replace(/[\[\](){}',"]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  if (strip(a) === strip(e)) return true;

  // Numeric float tolerance check
  const numA = parseFloat(a);
  const numE = parseFloat(e);
  if (!isNaN(numA) && !isNaN(numE) && Math.abs(numA - numE) < 0.001) {
    return true;
  }

  return false;
}

// =========================================================================
// MULTI-LANGUAGE CODE EXECUTION ENGINE
// Supports: Python 3, C, C++17, Java 17
// =========================================================================
function executeCode(language = "python", code, inputString = "", timeoutMs = 4000) {
  return new Promise((resolve) => {
    const lang = (language || "python").toLowerCase();
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "prepgo-exec-"));

    const cleanup = () => {
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch (err) {
        // Ignore cleanup errors
      }
    };

    const runProcess = (cmd, args, stdinData) => {
      let isTimedOut = false;
      let stdout = "";
      let stderr = "";

      const child = spawn(cmd, args, { cwd: tmpDir });

      const timer = setTimeout(() => {
        isTimedOut = true;
        child.kill("SIGKILL");
        cleanup();
        resolve({
          success: false,
          output: "",
          error: "Time Limit Exceeded (execution exceeded limit)",
        });
      }, timeoutMs);

      if (stdinData) {
        try {
          child.stdin.write(stdinData.endsWith("\n") ? stdinData : stdinData + "\n");
          child.stdin.end();
        } catch (e) {
          // Stdin write error
        }
      } else {
        child.stdin.end();
      }

      child.stdout.on("data", (d) => {
        stdout += d.toString();
      });

      child.stderr.on("data", (d) => {
        stderr += d.toString();
      });

      child.on("close", (exitCode) => {
        clearTimeout(timer);
        cleanup();
        if (isTimedOut) return;

        if (exitCode !== 0 && !stdout.trim()) {
          return resolve({
            success: false,
            output: stdout.trim(),
            error: stderr.trim() || `Runtime Error (exit code ${exitCode})`,
          });
        }

        resolve({
          success: true,
          output: stdout.trim(),
          error: stderr.trim() || null,
        });
      });

      child.on("error", (err) => {
        clearTimeout(timer);
        cleanup();
        resolve({
          success: false,
          output: "",
          error: `Execution Error: ${err.message}`,
        });
      });
    };

    // 1. PYTHON 3
    if (lang === "python" || lang === "python3") {
      const scriptPath = path.join(tmpDir, "solution.py");
      fs.writeFileSync(scriptPath, code);
      return runProcess("python3", [scriptPath], inputString);
    }

    // 2. C (GCC)
    if (lang === "c") {
      const srcPath = path.join(tmpDir, "solution.c");
      const binPath = path.join(tmpDir, "solution");
      fs.writeFileSync(srcPath, code);

      exec(`gcc "${srcPath}" -o "${binPath}" -lm`, { timeout: 12000 }, (compileErr, compStdout, compStderr) => {
        if (compileErr) {
          cleanup();
          return resolve({
            success: false,
            output: "",
            error: `Compilation Error:\n${compStderr || compileErr.message}`,
          });
        }
        runProcess(binPath, [], inputString);
      });
      return;
    }

    // 3. C++17 (G++)
    if (lang === "cpp" || lang === "cpp17" || lang === "c++") {
      const srcPath = path.join(tmpDir, "solution.cpp");
      const binPath = path.join(tmpDir, "solution");
      fs.writeFileSync(srcPath, code);

      exec(`g++ -std=c++17 "${srcPath}" -o "${binPath}"`, { timeout: 12000 }, (compileErr, compStdout, compStderr) => {
        if (compileErr) {
          cleanup();
          return resolve({
            success: false,
            output: "",
            error: `Compilation Error:\n${compStderr || compileErr.message}`,
          });
        }
        runProcess(binPath, [], inputString);
      });
      return;
    }

    // 4. JAVA 17
    if (lang === "java" || lang === "java17") {
      // Ensure class name matches file or default to Main
      let adjustedCode = code;
      let className = "Main";
      const match = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      if (match) {
        className = match[1];
      } else if (!code.includes("class Main")) {
        adjustedCode = `import java.util.*;\npublic class Main {\n${code}\n}`;
      }

      const srcPath = path.join(tmpDir, `${className}.java`);
      fs.writeFileSync(srcPath, adjustedCode);

      exec(`javac "${srcPath}"`, { timeout: 15000 }, (compileErr, compStdout, compStderr) => {
        if (compileErr) {
          cleanup();
          return resolve({
            success: false,
            output: "",
            error: `Compilation Error:\n${compStderr || compileErr.message}`,
          });
        }
        runProcess("java", ["-cp", tmpDir, className], inputString);
      });
      return;
    }

    // Fallback: Python
    const scriptPath = path.join(tmpDir, "solution.py");
    fs.writeFileSync(scriptPath, code);
    runProcess("python3", [scriptPath], inputString);
  });
}

// =========================================================================
// GET /api/dsa/:difficulty
// Returns 2 randomly selected questions (using MongoDB $sample)
// Hidden test cases are sanitized before returning to frontend
// =========================================================================
const getDSAQuestionsByDifficulty = async (req, res) => {
  try {
    const difficulty = req.params.difficulty.toLowerCase();

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level. Must be 'easy', 'medium', or 'hard'.",
      });
    }

    // Randomly select 2 questions from chosen difficulty
    const questions = await DSAQuestion.aggregate([
      { $match: { difficulty } },
      { $sample: { size: 2 } },
    ]);

    // Sanitize questions so hidden test cases are not sent to frontend
    const sanitizedQuestions = questions.map((q) => {
      const publicCases = (q.testCases || []).filter((tc) => !tc.isHidden);
      return {
        _id: q._id,
        title: q.title,
        difficulty: q.difficulty,
        topic: q.topic,
        description: q.description,
        examples: q.examples,
        constraints: q.constraints,
        starterCode: q.starterCode,
        marks: q.marks || 30,
        hints: q.hints || [],
        testCases: publicCases,
      };
    });

    return res.status(200).json({
      success: true,
      count: sanitizedQuestions.length,
      difficulty,
      questions: sanitizedQuestions,
    });
  } catch (error) {
    console.error("Error fetching DSA questions:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching questions.",
      error: error.message,
    });
  }
};

// =========================================================================
// POST /api/dsa/run
// Runs code against sample test cases (isHidden: false)
// =========================================================================
const runDSACode = async (req, res) => {
  try {
    const { questionId, code, language = "python" } = req.body;

    if (!questionId || !code) {
      return res.status(400).json({
        success: false,
        message: "questionId and code are required.",
      });
    }

    const question = await DSAQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    const sampleCases = question.testCases.filter((tc) => !tc.isHidden);
    const results = [];
    let allPassed = true;

    for (let i = 0; i < sampleCases.length; i++) {
      const tc = sampleCases[i];
      const stdinInput = tc.rawInput || tc.input;
      const start = Date.now();
      const execResult = await executeCode(language, code, stdinInput);
      const executionTime = Date.now() - start;

      const passed =
        execResult.success &&
        areOutputsEquivalent(execResult.output, tc.expectedOutput);

      if (!passed) allPassed = false;

      results.push({
        testCaseIndex: i + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: execResult.output || "",
        error: execResult.error || null,
        passed,
        executionTime: `${executionTime}ms`,
      });
    }

    return res.status(200).json({
      success: true,
      allPassed,
      results,
    });
  } catch (error) {
    console.error("Error running code:", error);
    return res.status(500).json({
      success: false,
      message: "Execution error.",
      error: error.message,
    });
  }
};

// =========================================================================
// PLACEMENT READINESS ANALYSIS GENERATOR
// Differentiates PrepGo from other platforms
// =========================================================================
function generateReadinessAnalysis(difficulty, evaluatedAnswers, totalScore) {
  const strongTopics = [];
  const weakTopics = [];

  evaluatedAnswers.forEach((ans) => {
    const topic = ans.topic || "Data Structures";
    if (ans.passed) {
      if (!strongTopics.includes(topic)) strongTopics.push(topic);
    } else {
      if (!weakTopics.includes(topic)) weakTopics.push(topic);
    }
  });

  const percentage = Math.round((totalScore / 60) * 100);

  // Suggested next topic
  let suggestedNextTopic = "";
  if (weakTopics.length > 0) {
    suggestedNextTopic = weakTopics[0];
  } else if (difficulty === "easy") {
    suggestedNextTopic = "Dynamic Programming & Trees";
  } else if (difficulty === "medium") {
    suggestedNextTopic = "Graphs & Advanced DP";
  } else {
    suggestedNextTopic = "System Design & Segment Trees";
  }

  // Recommended Company Level
  let recommendedCompanyLevel = "";
  if (difficulty === "hard" && percentage >= 70) {
    recommendedCompanyLevel = "Tier 1 Product Companies (Google, Microsoft, Amazon, Uber)";
  } else if (difficulty === "medium" && percentage >= 80) {
    recommendedCompanyLevel = "Tier 1 / Tier 2 Tech Companies (Flipkart, Swiggy, Zomato, Atlassian)";
  } else if (percentage >= 50) {
    recommendedCompanyLevel = "Mid-tier Product & High-Growth Startups (Razorpay, CRED, PhonePe)";
  } else {
    recommendedCompanyLevel = "Service-based & IT Consulting Firms (TCS, Infosys, Wipro, Accenture)";
  }

  // Custom actionable recommendation
  let recommendation = "";
  if (weakTopics.length > 0) {
    recommendation = `Practice 3 ${weakTopics[0]} problems to strengthen algorithmic patterns before attempting the next level.`;
  } else if (percentage === 100) {
    recommendation = `Outstanding performance! You are fully ready to tackle ${difficulty === "hard" ? "System Design and Live Coding Rounds" : "the next difficulty mode"}.`;
  } else {
    recommendation = `Review edge cases and time complexities to achieve a 100% pass rate.`;
  }

  return {
    strongTopics: strongTopics.length > 0 ? strongTopics : ["Basic Problem Solving"],
    weakTopics: weakTopics.length > 0 ? weakTopics : ["None identified — Excellent Mastery!"],
    accuracy: `${percentage}%`,
    suggestedNextTopic,
    recommendedCompanyLevel,
    recommendation,
  };
}

// =========================================================================
// POST /api/dsa/submit
// Evaluates all questions against visible + hidden test cases
// Saves attempt into MongoDB collection dsaAttempts
// =========================================================================
const submitDSATest = async (req, res) => {
  try {
    const {
      difficulty,
      language = "python",
      answers = [],
      userId = null,
      timeUsed = "",
    } = req.body;

    if (!difficulty || !["easy", "medium", "hard"].includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Valid difficulty level is required.",
      });
    }

    const diff = difficulty.toLowerCase();

    // Determine the question IDs submitted
    const questionIds = answers.map((a) => a.questionId);
    let questions = [];

    if (questionIds.length > 0) {
      questions = await DSAQuestion.find({ _id: { $in: questionIds } });
    } else {
      questions = await DSAQuestion.find({ difficulty: diff }).limit(2);
    }

    let totalScore = 0;
    let passedQuestions = 0;
    let failedQuestions = 0;
    const evaluatedAnswers = [];
    const codeMap = {};

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const userSubmission = answers.find(
        (a) => a.questionId?.toString() === q._id.toString()
      ) || answers[i];

      const userCode =
        userSubmission && typeof userSubmission === "object"
          ? userSubmission.code
          : userSubmission || "";

      codeMap[q._id.toString()] = userCode;

      let questionPassed = false;
      const testCaseResults = [];

      if (userCode && userCode.trim()) {
        let allCasesPassed = true;

        for (const tc of q.testCases) {
          const stdinInput = tc.rawInput || tc.input;
          const execResult = await executeCode(language, userCode, stdinInput);
          const passed =
            execResult.success &&
            areOutputsEquivalent(execResult.output, tc.expectedOutput);

          if (!passed) allCasesPassed = false;

          testCaseResults.push({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: execResult.output || "",
            passed,
            isHidden: tc.isHidden,
          });
        }

        if (allCasesPassed && q.testCases.length > 0) {
          questionPassed = true;
          totalScore += 30; // 30 marks per question (Total 60)
          passedQuestions++;
        } else {
          failedQuestions++;
        }
      } else {
        failedQuestions++;
      }

      evaluatedAnswers.push({
        questionId: q._id,
        title: q.title,
        topic: q.topic || "Data Structures",
        code: userCode,
        passed: questionPassed,
        score: questionPassed ? 30 : 0,
        marks: 30,
        testCases: testCaseResults,
      });
    }

    const percentage = Math.round((totalScore / 60) * 100);

    // Generate Placement Readiness Analysis
    const readinessAnalysis = generateReadinessAnalysis(
      diff,
      evaluatedAnswers,
      totalScore
    );

    // Save into dsaAttempts collection
    const attempt = await DSAAttempt.create({
      userId: userId || null,
      difficulty: diff,
      language,
      selectedQuestions: questions.map((q) => q._id),
      code: codeMap,
      answers: evaluatedAnswers,
      score: totalScore,
      percentage,
      passedQuestions,
      failedQuestions,
      timeUsed,
      readinessAnalysis,
      completedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      difficulty: diff,
      language,
      score: totalScore,
      percentage,
      passedQuestions,
      failedQuestions,
      totalQuestions: questions.length,
      timeUsed,
      attemptId: attempt._id,
      answers: evaluatedAnswers,
      readinessAnalysis,
    });
  } catch (error) {
    console.error("Error submitting DSA assessment:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while evaluating DSA test.",
      error: error.message,
    });
  }
};

// =========================================================================
// GET /api/dsa/latest-attempt
// Retrieves the most recent DSA attempt
// =========================================================================
const getLatestDSAAttempt = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId) {
      query.userId = userId;
    }

    let latest = await DSAAttempt.findOne(query)
      .sort({ completedAt: -1, createdAt: -1 })
      .populate("userId", "name email");

    if (!latest && userId) {
      latest = await DSAAttempt.findOne({})
        .sort({ completedAt: -1, createdAt: -1 })
        .populate("userId", "name email");
    }

    return res.status(200).json({
      success: true,
      attempt: latest || null,
    });
  } catch (error) {
    console.error("Error fetching latest DSA attempt:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

module.exports = {
  getDSAQuestionsByDifficulty,
  runDSACode,
  submitDSATest,
  getLatestDSAAttempt,
};
