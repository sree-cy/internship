import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DSATest.css";

const DEFAULT_STARTER_CODES = {
  python: `def solve():
    # Write your code here
    pass

if __name__ == "__main__":
    solve()
`,
  c: `#include <stdio.h>

int main() {
    // Write your code here

    return 0;
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here

    return 0;
}
`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}
`,
};

function DSATest() {
  const { level = "easy" } = useParams();
  const navigate = useNavigate();

  const timerDurations = {
    easy: 25 * 60,
    medium: 45 * 60,
    hard: 60 * 60,
  };

  const initialTime = timerDurations[level.toLowerCase()] || 25 * 60;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Multi-Language: python | c | cpp | java
  const [selectedLanguage, setSelectedLanguage] = useState("python");

  // Map of questionId -> { python: code, c: code, cpp: code, java: code }
  const [codeAnswers, setCodeAnswers] = useState({});

  // Map of questionId -> { passed: boolean, score: number, results: [] }
  const [questionStatus, setQuestionStatus] = useState({});

  // Active terminal tab: 'testcases' | 'results'
  const [activeTab, setActiveTab] = useState("testcases");
  const [runningCode, setRunningCode] = useState(false);
  const [runResults, setRunResults] = useState(null);

  // Time & Submission
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [submittingTest, setSubmittingTest] = useState(false);

  // Candidate
  const [user, setUser] = useState(null);

  const codeAnswersRef = useRef(codeAnswers);
  codeAnswersRef.current = codeAnswers;

  const selectedLanguageRef = useRef(selectedLanguage);
  selectedLanguageRef.current = selectedLanguage;

  const questionsRef = useRef(questions);
  questionsRef.current = questions;

  const questionStatusRef = useRef(questionStatus);
  questionStatusRef.current = questionStatus;

  // =========================================================================
  // LOAD USER & DYNAMIC QUESTIONS
  // =========================================================================
  useEffect(() => {
    try {
      const stored = localStorage.getItem("prepgoUser");
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        // GET /api/dsa/:difficulty returns random 2 questions
        const res = await axios.get(
          `http://localhost:5000/api/dsa/${level.toLowerCase()}`
        );

        if (res.data && res.data.questions && res.data.questions.length > 0) {
          const qs = res.data.questions;
          setQuestions(qs);

          // Initialize starter codes per language for each question
          const initialCode = {};
          const initialStatus = {};

          qs.forEach((q) => {
            const sc = q.starterCode || {};
            initialCode[q._id] = {
              python:
                typeof sc === "object" && sc.python
                  ? sc.python
                  : typeof sc === "string"
                  ? sc
                  : DEFAULT_STARTER_CODES.python,
              c:
                typeof sc === "object" && sc.c
                  ? sc.c
                  : DEFAULT_STARTER_CODES.c,
              cpp:
                typeof sc === "object" && sc.cpp
                  ? sc.cpp
                  : DEFAULT_STARTER_CODES.cpp,
              java:
                typeof sc === "object" && sc.java
                  ? sc.java
                  : DEFAULT_STARTER_CODES.java,
            };
            initialStatus[q._id] = { passed: false, score: 0, results: null };
          });

          setCodeAnswers(initialCode);
          setQuestionStatus(initialStatus);
        }
      } catch (err) {
        console.error("Failed to fetch DSA questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [level]);

  // =========================================================================
  // COUNTDOWN TIMER
  // =========================================================================
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Time limit reached! Submitting your assessment.");
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level]);

  // Format time (mm:ss)
  const formatTimer = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const calculateTimeUsed = () => {
    const diff = initialTime - timeLeft;
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${m} mins ${s} secs`;
  };

  const currentQ = questions[currentIdx] || null;
  const currentQCodes = (currentQ && codeAnswers[currentQ._id]) || {};
  const currentCode = currentQCodes[selectedLanguage] || "";

  // Handle Language Change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setRunResults(null);

    // Switching the language immediately loads that language's starter template
    if (currentQ) {
      const sc = currentQ.starterCode || {};
      const template =
        typeof sc === "object" && sc[newLang]
          ? sc[newLang]
          : DEFAULT_STARTER_CODES[newLang];

      setCodeAnswers((prev) => ({
        ...prev,
        [currentQ._id]: {
          ...(prev[currentQ._id] || {}),
          [newLang]: prev[currentQ._id]?.[newLang] || template,
        },
      }));
    }
  };

  // Handle Code Change with Tab indentation support
  const handleCodeChange = (e) => {
    if (!currentQ) return;
    const val = e.target.value;
    setCodeAnswers((prev) => ({
      ...prev,
      [currentQ._id]: {
        ...(prev[currentQ._id] || {}),
        [selectedLanguage]: val,
      },
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = e.target.value;
      const newVal = val.substring(0, start) + "    " + val.substring(end);
      if (currentQ) {
        setCodeAnswers((prev) => ({
          ...prev,
          [currentQ._id]: {
            ...(prev[currentQ._id] || {}),
            [selectedLanguage]: newVal,
          },
        }));
      }
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Reset Code restores the starter template of the currently selected language
  const handleResetCode = () => {
    if (!currentQ) return;
    const sc = currentQ.starterCode || {};
    const template =
      typeof sc === "object" && sc[selectedLanguage]
        ? sc[selectedLanguage]
        : DEFAULT_STARTER_CODES[selectedLanguage];

    setCodeAnswers((prev) => ({
      ...prev,
      [currentQ._id]: {
        ...(prev[currentQ._id] || {}),
        [selectedLanguage]: template,
      },
    }));
    setRunResults(null);
  };

  // =========================================================================
  // RUN CODE (AGAINST SAMPLE TEST CASES)
  // =========================================================================
  const handleRunCode = async () => {
    if (!currentQ) return;
    try {
      setRunningCode(true);
      setActiveTab("results");

      const res = await axios.post("http://localhost:5000/api/dsa/run", {
        questionId: currentQ._id,
        code: currentCode,
        language: selectedLanguage,
      });

      setRunResults(res.data);
    } catch (err) {
      console.error("Code run error:", err);
      setRunResults({
        success: false,
        allPassed: false,
        results: [
          {
            testCaseIndex: 1,
            error: "Failed to connect to execution server. Ensure backend is running.",
          },
        ],
      });
    } finally {
      setRunningCode(false);
    }
  };

  // =========================================================================
  // SUBMIT CURRENT PROBLEM CODE
  // =========================================================================
  const handleSubmitCode = async () => {
    if (!currentQ) return;
    try {
      setRunningCode(true);
      setActiveTab("results");

      // Run code against sample cases
      const res = await axios.post("http://localhost:5000/api/dsa/run", {
        questionId: currentQ._id,
        code: currentCode,
        language: selectedLanguage,
      });

      const data = res.data;
      setRunResults(data);

      const passed = data.allPassed;
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQ._id]: {
          passed,
          score: passed ? 30 : 0,
          results: data.results,
        },
      }));
    } catch (err) {
      console.error("Code submission error:", err);
    } finally {
      setRunningCode(false);
    }
  };

  // =========================================================================
  // FINAL ASSESSMENT SUBMISSION
  // =========================================================================
  const handleFinalSubmit = async () => {
    try {
      setSubmittingTest(true);
      const timeUsed = calculateTimeUsed();

      const answersPayload = questions.map((q) => {
        const langCodes = codeAnswersRef.current[q._id] || {};
        return {
          questionId: q._id,
          code: langCodes[selectedLanguageRef.current] || "",
        };
      });

      const res = await axios.post("http://localhost:5000/api/dsa/submit", {
        difficulty: level.toLowerCase(),
        language: selectedLanguage,
        answers: answersPayload,
        userId: user?.id || user?._id || null,
        timeUsed,
      });

      const data = res.data;

      navigate("/dsa/result", {
        state: {
          difficulty: level,
          language: selectedLanguage,
          score: data.score,
          percentage: data.percentage,
          passedQuestions: data.passedQuestions,
          failedQuestions: data.failedQuestions,
          totalQuestions: data.totalQuestions,
          timeUsed: data.timeUsed,
          answers: data.answers,
          readinessAnalysis: data.readinessAnalysis,
        },
      });
    } catch (err) {
      console.error("Final submit error:", err);
      alert("Failed to submit assessment. Please check backend connection.");
    } finally {
      setSubmittingTest(false);
    }
  };

  // Calculate live total score
  const totalLiveScore = Object.values(questionStatus).reduce(
    (acc, cur) => acc + (cur.score || 0),
    0
  );

  if (loading) {
    return (
      <div className="dsa-test-page loading-view">
        <div className="loader-box">
          <div className="spinner"></div>
          <h2>Setting Up {level.toUpperCase()} Workspace...</h2>
          <p>Sampling random challenges & initializing compiler runtimes...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="dsa-test-page loading-view">
        <div className="loader-box">
          <h2>No Questions Available</h2>
          <p>Please ensure questions are seeded in MongoDB.</p>
          <button className="reset-btn" onClick={() => navigate("/dsa")}>
            Return to Modes
          </button>
        </div>
      </div>
    );
  }

  const currentQStatus = questionStatus[currentQ?._id] || {
    passed: false,
    score: 0,
  };

  return (
    <div className={`dsa-test-page theme-${level.toLowerCase()}`}>
      {/* ================= HEADER ================= */}
      <header className="test-header-bar">
        <div className="th-left">
          <span className="diff-badge">{level.toUpperCase()} MODE</span>
          <div className="th-title-group">
            <h3>Round 2 (DSA Technical Assessment)</h3>
            <span className="question-tracker">
              Problem {currentIdx + 1} of {questions.length}
            </span>
          </div>
        </div>

        <div className="th-center">
          <div
            className={`countdown-timer-box ${
              timeLeft <= 300 ? "warning" : ""
            }`}
          >
            <span className="timer-icon">⏱️</span>
            <span className="time-display">{formatTimer(timeLeft)}</span>
          </div>
          <div className="th-total-marks">
            <span>TOTAL:</span>
            <strong>60 Marks</strong>
          </div>
        </div>

        <div className="th-right">
          <button
            type="button"
            className="end-test-header-btn"
            onClick={() => setShowEndModal(true)}
          >
            End Test
          </button>
          <div className="candidate-badge">
            <span className="avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
            </span>
            <div className="meta">
              <strong>{user?.name || "Candidate"}</strong>
              <small>ID: PG-2026</small>
            </div>
          </div>
        </div>
      </header>

      {/* ================= 3-COLUMN WORKSPACE ================= */}
      <div className="dsa-workspace-body">
        {/* ================= COLUMN 1: LEFT SIDEBAR ================= */}
        <aside className="dsa-left-sidebar">
          <div className="sidebar-section-title">QUESTION NAVIGATOR</div>

          <div className="sidebar-question-list">
            {questions.map((q, idx) => {
              const qStat = questionStatus[q._id] || {};
              const isCurrent = idx === currentIdx;

              return (
                <div
                  key={q._id}
                  className={`sb-question-item ${isCurrent ? "active" : ""} ${
                    qStat.passed ? "passed" : ""
                  }`}
                  onClick={() => {
                    setCurrentIdx(idx);
                    setRunResults(null);
                  }}
                >
                  <div className="sb-q-top">
                    <span className="q-badge">Q{idx + 1}</span>
                    <span className="q-name">{q.title}</span>
                  </div>
                  <div className="sb-q-meta">
                    <span className="topic-pill">{q.topic || "DSA"}</span>
                  </div>
                  <div className="sb-q-bottom">
                    <span className="marks-pill">30 Marks</span>
                    {qStat.passed ? (
                      <span className="status-pill passed">✓ Passed (30 pts)</span>
                    ) : (
                      <span className="status-pill pending">Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CURRENT SCORE */}
          <div className="sidebar-live-score-card">
            <div className="score-top">
              <span>CURRENT SCORE</span>
              <strong>
                {totalLiveScore} <span>/ 60</span>
              </strong>
            </div>
            <div className="score-progress-bar">
              <div
                className="score-fill"
                style={{ width: `${(totalLiveScore / 60) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* QUESTION STATUS SUMMARY */}
          <div className="sidebar-status-card">
            <h4>Question Status</h4>
            <div className="status-metric-row">
              <span>Mode Difficulty:</span>
              <strong className="status-tag">{level.toUpperCase()}</strong>
            </div>
            <div className="status-metric-row">
              <span>Active Language:</span>
              <strong>{selectedLanguage.toUpperCase()}</strong>
            </div>
            <div className="status-metric-row">
              <span>Solved:</span>
              <strong>
                {Object.values(questionStatus).filter((s) => s.passed).length} / 2
              </strong>
            </div>
          </div>

          {/* LEGEND */}
          <div className="sidebar-legend-card">
            <h4>Legend</h4>
            <div className="legend-item">
              <span className="dot passed"></span> Passed (30 pts)
            </div>
            <div className="legend-item">
              <span className="dot current"></span> Current Active
            </div>
            <div className="legend-item">
              <span className="dot pending"></span> Pending / Unattempted
            </div>
          </div>

          {/* NEED HELP & GET HINT CARD */}
          <div className="sidebar-help-card">
            <div className="help-icon">💡</div>
            <h4>Stuck on this problem?</h4>
            <p>View algorithmic hints and strategies without penalty.</p>
            <button
              type="button"
              className="hint-btn"
              onClick={() => setShowHintModal(true)}
            >
              Get Hint
            </button>
          </div>
        </aside>

        {/* ================= COLUMN 2: CENTER PROBLEM DESCRIPTION ================= */}
        <section className="dsa-center-panel">
          <div className="problem-header">
            <div className="p-title-row">
              <h2>
                {currentIdx + 1}. {currentQ.title}
              </h2>
              <span className="marks-tag">30 Marks</span>
            </div>
            <div className="p-meta-chips">
              <span className="diff-chip">{level.toUpperCase()}</span>
              <span className="topic-chip-tag">Topic: {currentQ.topic || "DSA"}</span>
              <span className="lang-chip-tag">Multi-Lang</span>
            </div>
          </div>

          <div className="problem-body">
            <div className="section-label">PROBLEM STATEMENT</div>
            <p className="description-text">{currentQ.description}</p>

            <div className="section-label">EXAMPLES</div>
            <div className="examples-list">
              {currentQ.examples?.map((ex, i) => (
                <div className="example-card" key={i}>
                  <strong>Example {i + 1}:</strong>
                  <div className="ex-line">
                    <span className="lbl">Input:</span>
                    <code>{ex.input}</code>
                  </div>
                  <div className="ex-line">
                    <span className="lbl">Output:</span>
                    <code>{ex.output}</code>
                  </div>
                  {ex.explanation && (
                    <div className="ex-line">
                      <span className="lbl">Explanation:</span>
                      <span className="exp-text">{ex.explanation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="section-label">CONSTRAINTS</div>
            <ul className="constraints-list">
              {currentQ.constraints?.map((c, i) => (
                <li key={i}>
                  <code>{c}</code>
                </li>
              ))}
            </ul>
          </div>

          {/* PROBLEM NAVIGATION */}
          <div className="problem-nav-footer">
            <button
              type="button"
              className="p-nav-btn"
              disabled={currentIdx === 0}
              onClick={() => {
                setCurrentIdx(currentIdx - 1);
                setRunResults(null);
              }}
            >
              ← Previous Problem
            </button>
            <button
              type="button"
              className="p-nav-btn"
              disabled={currentIdx === questions.length - 1}
              onClick={() => {
                setCurrentIdx(currentIdx + 1);
                setRunResults(null);
              }}
            >
              Next Problem →
            </button>
          </div>
        </section>

        {/* ================= COLUMN 3: RIGHT PANEL (MULTI-LANG CODE EDITOR) ================= */}
        <section className="dsa-right-panel">
          {/* EDITOR CONTROLS BAR */}
          <div className="editor-controls-bar">
            {/* MULTI-LANGUAGE SELECTOR */}
            <div className="lang-selector-group">
              <label htmlFor="lang-select" className="lang-label">
                Language:
              </label>
              <select
                id="lang-select"
                className="lang-select-dropdown"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <option value="python">🐍 Python 3</option>
                <option value="c">⚙️ C (GCC)</option>
                <option value="cpp">⚡ C++17 (G++)</option>
                <option value="java">☕ Java 17</option>
              </select>
            </div>

            <div className="editor-actions">
              <button
                type="button"
                className="ed-btn reset-btn"
                title="Reset code to original starter template"
                onClick={handleResetCode}
              >
                Reset Code
              </button>
              <button
                type="button"
                className="ed-btn run-btn"
                disabled={runningCode}
                onClick={handleRunCode}
              >
                {runningCode ? "Executing..." : "▶ Run Code"}
              </button>
              <button
                type="button"
                className="ed-btn submit-code-btn"
                disabled={runningCode}
                onClick={handleSubmitCode}
              >
                ✓ Submit Code
              </button>
            </div>
          </div>

          {/* CODE EDITOR TEXTAREA */}
          <div className="code-editor-wrapper">
            <textarea
              className="code-textarea"
              value={currentCode}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              placeholder={`// Write your ${selectedLanguage.toUpperCase()} solution here...`}
            ></textarea>
          </div>

          {/* BOTTOM TERMINAL / OUTPUT PANEL */}
          <div className="terminal-panel">
            <div className="terminal-tabs-bar">
              <button
                type="button"
                className={`term-tab ${
                  activeTab === "testcases" ? "active" : ""
                }`}
                onClick={() => setActiveTab("testcases")}
              >
                Sample Test Cases
              </button>
              <button
                type="button"
                className={`term-tab ${activeTab === "results" ? "active" : ""}`}
                onClick={() => setActiveTab("results")}
              >
                Terminal Output{" "}
                {runResults ? (runResults.allPassed ? "✅ Pass" : "❌ Fail") : ""}
              </button>
            </div>

            <div className="terminal-content">
              {activeTab === "testcases" && (
                <div className="testcases-view">
                  {currentQ.testCases
                    ?.filter((tc) => !tc.isHidden)
                    .map((tc, idx) => (
                      <div className="testcase-item" key={idx}>
                        <span className="tc-header">Sample Case {idx + 1}</span>
                        <div className="tc-details">
                          <div>
                            <span className="tc-lbl">Input:</span>
                            <code>{tc.input}</code>
                          </div>
                          <div>
                            <span className="tc-lbl">Expected Output:</span>
                            <code>{tc.expectedOutput}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === "results" && (
                <div className="results-view">
                  {!runResults && !runningCode && (
                    <div className="no-run-prompt">
                      Click <strong>▶ Run Code</strong> to compile and execute your{" "}
                      {selectedLanguage.toUpperCase()} code against sample cases.
                    </div>
                  )}

                  {runningCode && (
                    <div className="running-prompt">
                      Compiling and executing in {selectedLanguage.toUpperCase()}{" "}
                      runtime environment... please wait.
                    </div>
                  )}

                  {runResults && (
                    <div className="execution-result-list">
                      <div
                        className={`execution-summary ${
                          runResults.allPassed ? "passed" : "failed"
                        }`}
                      >
                        <strong>
                          {runResults.allPassed
                            ? "🎉 All Sample Cases Passed!"
                            : "❌ Some Test Cases Failed"}
                        </strong>
                      </div>

                      {runResults.results?.map((res, i) => (
                        <div
                          className={`case-result-card ${
                            res.passed ? "passed" : "failed"
                          }`}
                          key={i}
                        >
                          <div className="cr-top">
                            <span>Case {res.testCaseIndex}</span>
                            <span
                              className={`status-badge ${
                                res.passed ? "pass" : "fail"
                              }`}
                            >
                              {res.passed ? "PASSED" : "FAILED"}
                            </span>
                            {res.executionTime && (
                              <span className="time-tag">
                                {res.executionTime}
                              </span>
                            )}
                          </div>

                          {res.error ? (
                            <pre className="error-output">{res.error}</pre>
                          ) : (
                            <div className="cr-data">
                              <div>
                                <span className="data-lbl">Input:</span>
                                <code>{res.input}</code>
                              </div>
                              <div>
                                <span className="data-lbl">Expected Output:</span>
                                <code>{res.expectedOutput}</code>
                              </div>
                              <div>
                                <span className="data-lbl">User Output:</span>
                                <code className={res.passed ? "good" : "bad"}>
                                  {res.actualOutput || "<empty>"}
                                </code>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* EDITOR FOOTER */}
          <footer className="editor-status-footer">
            <div className="footer-left">
              <span className="q-score-indicator">
                Question Score:{" "}
                <strong>
                  {currentQStatus.passed ? "30 / 30 Marks" : "0 / 30 Marks"}
                </strong>
              </span>
            </div>

            <div className="footer-right">
              <span className="total-score-indicator">
                Total Score: <strong>{totalLiveScore} / 60</strong>
              </span>
              <button
                type="button"
                className="save-answer-btn"
                onClick={handleSubmitCode}
              >
                Save Answer
              </button>
            </div>
          </footer>
        </section>
      </div>

      {/* ================= CONFIRM END TEST MODAL ================= */}
      {showEndModal && (
        <div className="dsa-modal-overlay">
          <div className="dsa-end-modal">
            <h2>End DSA Assessment?</h2>
            <p>
              Are you sure you want to finalize your technical submission? Once
              submitted, your code will be evaluated against all test cases and
              your Placement Readiness Analysis will be generated.
            </p>

            <div className="modal-stats-summary">
              <div className="summary-box">
                <span>SOLVED</span>
                <strong>
                  {
                    Object.values(questionStatus).filter((s) => s.passed).length
                  }{" "}
                  / 2
                </strong>
              </div>
              <div className="summary-box">
                <span>ESTIMATED SCORE</span>
                <strong className="green">{totalLiveScore} / 60</strong>
              </div>
              <div className="summary-box">
                <span>TIME REMAINING</span>
                <strong>{formatTimer(timeLeft)}</strong>
              </div>
            </div>

            <div className="modal-btn-row">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowEndModal(false)}
                disabled={submittingTest}
              >
                Continue Coding
              </button>
              <button
                type="button"
                className="btn-confirm-end"
                onClick={handleFinalSubmit}
                disabled={submittingTest}
              >
                {submittingTest
                  ? "Analyzing Performance..."
                  : "Confirm & View Readiness"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HINT MODAL ================= */}
      {showHintModal && (
        <div
          className="dsa-modal-overlay"
          onClick={() => setShowHintModal(false)}
        >
          <div className="dsa-hint-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hint-modal-header">
              <h3>💡 Algorithmic Hints</h3>
              <button
                type="button"
                className="close-hint-btn"
                onClick={() => setShowHintModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="hint-modal-body">
              <h4>{currentQ?.title}</h4>
              <span className="modal-topic-chip">
                Topic: {currentQ?.topic || "DSA"}
              </span>
              {currentQ?.hints && currentQ.hints.length > 0 ? (
                <ul className="hints-list">
                  {currentQ.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              ) : (
                <p>No hints available for this problem.</p>
              )}
            </div>

            <div className="hint-modal-footer">
              <button
                type="button"
                className="got-it-btn"
                onClick={() => setShowHintModal(false)}
              >
                Got It, Let's Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DSATest;
