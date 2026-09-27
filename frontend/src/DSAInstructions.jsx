import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DSAInstructions.css";

function DSAInstructions() {
  const { level = "easy" } = useParams();
  const navigate = useNavigate();

  const difficultyMeta = {
    easy: {
      time: "25",
      colorClass: "easy",
      label: "EASY MODE",
      accent: "#10b981",
    },
    medium: {
      time: "45",
      colorClass: "medium",
      label: "MEDIUM MODE",
      accent: "#f59e0b",
    },
    hard: {
      time: "60",
      colorClass: "hard",
      label: "HARD MODE",
      accent: "#ef4444",
    },
  };

  const meta = difficultyMeta[level.toLowerCase()] || difficultyMeta.easy;

  return (
    <div className={`dsa-instructions-page ${meta.colorClass}`}>
      <div className="instructions-card">
        <div className="instructions-badge-row">
          <span className="round-tag">ROUND 2 • DSA TECHNICAL ASSESSMENT</span>
          <span className="diff-tag">{meta.label}</span>
        </div>

        <h1>{level.toUpperCase()} Technical Assessment</h1>
        <p className="subtitle">
          Please review the technical parameters, supported programming environments, and execution guidelines before starting.
        </p>

        {/* METRICS GRID */}
        <div className="instructions-metrics-grid">
          <div className="instr-metric-card">
            <span className="icon">🎯</span>
            <span className="label">DIFFICULTY</span>
            <strong>{level.toUpperCase()}</strong>
          </div>

          <div className="instr-metric-card">
            <span className="icon">📝</span>
            <span className="label">TOTAL QUESTIONS</span>
            <strong>2 Random Challenges</strong>
          </div>

          <div className="instr-metric-card">
            <span className="icon">⏱️</span>
            <span className="label">TIME LIMIT</span>
            <strong>{meta.time} Minutes</strong>
          </div>

          <div className="instr-metric-card">
            <span className="icon">🏆</span>
            <span className="label">TOTAL MARKS</span>
            <strong>60 Marks (30 / Problem)</strong>
          </div>

          <div className="instr-metric-card full-width">
            <span className="icon">💻</span>
            <span className="label">PROGRAMMING LANGUAGES</span>
            <strong>Python 3 • C (GCC) • C++17 (G++) • Java 17 (OpenJDK)</strong>
          </div>
        </div>

        {/* RULES */}
        <div className="rules-section">
          <h3>Assessment Instructions & Rules</h3>
          <ul>
            <li>
              Each coding problem is worth <strong>30 marks</strong> (Total: 60 marks). Both questions are randomly selected from MongoDB.
            </li>
            <li>
              You can code in your choice of <strong>Python 3, C, C++17, or Java 17</strong>. Switching language will load language-specific starter templates.
            </li>
            <li>
              To receive full marks for a problem, your code must pass <strong>all evaluation test cases</strong> (both visible sample cases and hidden test cases).
            </li>
            <li>
              Use <strong>▶ Run Code</strong> to test your solution against sample test cases without any limit or submission penalty.
            </li>
            <li>
              Execution time limit is <strong>4 seconds</strong> per test case with standard standard-input (stdin) and standard-output (stdout).
            </li>
            <li>
              The countdown timer starts as soon as you launch the assessment and <strong>cannot be paused</strong>.
            </li>
            <li>
              Upon submission, PrepGo generates a comprehensive <strong>Placement Readiness Analysis</strong> indicating strong topics, weak areas, and company tier recommendations.
            </li>
          </ul>
        </div>

        {/* ACTIONS */}
        <div className="instructions-action-row">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/dsa")}
          >
            ← Back to Modes
          </button>
          <button
            type="button"
            className="start-assessment-btn"
            onClick={() => navigate(`/dsa/test/${level.toLowerCase()}`)}
          >
            Start Assessment →
          </button>
        </div>
      </div>
    </div>
  );
}

export default DSAInstructions;
