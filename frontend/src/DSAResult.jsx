import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DSAResult.css";

function DSAResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="dsa-result-page">
        <div className="dsa-result-card empty-state">
          <h2>No Assessment Result Found</h2>
          <p>Please take a Round 2 technical assessment first.</p>
          <button className="primary-btn" onClick={() => navigate("/dsa")}>
            Explore DSA Modes
          </button>
        </div>
      </div>
    );
  }

  const {
    difficulty = "easy",
    language = "python",
    score = 0,
    percentage = 0,
    passedQuestions = 0,
    failedQuestions = 0,
    totalQuestions = 2,
    timeUsed = "N/A",
    answers = [],
    readinessAnalysis = {},
  } = state;

  const {
    strongTopics = ["Basic Problem Solving"],
    weakTopics = ["None — Solid performance!"],
    accuracy = `${percentage}%`,
    suggestedNextTopic = "Dynamic Programming",
    recommendedCompanyLevel = "Product Companies",
    recommendation = "Continue practicing DSA to maintain peak readiness.",
  } = readinessAnalysis || {};

  let badge = "Needs Practice";
  let badgeColor = "orange";
  if (percentage >= 90) {
    badge = "Master of DSA — Interview Ready!";
    badgeColor = "green";
  } else if (percentage >= 50) {
    badge = "Proficient — Good Algorithmic Foundation";
    badgeColor = "blue";
  }

  return (
    <div className={`dsa-result-page theme-${difficulty.toLowerCase()}`}>
      <div className="dsa-result-card">
        {/* TOP HEADER */}
        <div className="result-header-area">
          <div className="result-badges-row">
            <span className="round-pill">ROUND 2 • DSA RESULT</span>
            <span className="lang-pill">
              RUNTIME: {language.toUpperCase()}
            </span>
          </div>
          <h1>Technical Assessment Completed</h1>
          <p className="level-subtitle">
            Difficulty: <strong>{difficulty.toUpperCase()}</strong> • Total
            Evaluation Score: <strong>60 Marks</strong>
          </p>
        </div>

        {/* CIRCULAR SCORE VISUAL */}
        <div className="score-hero-visual">
          <div className="score-circle-ring">
            <strong>{score}</strong>
            <span>/ 60 MARKS</span>
          </div>
        </div>

        {/* PERFORMANCE BADGE */}
        <div className={`performance-badge ${badgeColor}`}>
          <span>🏆</span> {badge}
        </div>

        {/* METRICS GRID */}
        <div className="result-stats-grid">
          <div className="res-stat-box">
            <span className="s-label">PASSED PROBLEMS</span>
            <strong className="green">
              {passedQuestions} / {totalQuestions}
            </strong>
          </div>
          <div className="res-stat-box">
            <span className="s-label">FAILED PROBLEMS</span>
            <strong className={failedQuestions > 0 ? "red" : "green"}>
              {failedQuestions}
            </strong>
          </div>
          <div className="res-stat-box">
            <span className="s-label">ACCURACY</span>
            <strong>{accuracy}</strong>
          </div>
          <div className="res-stat-box">
            <span className="s-label">TIME USED</span>
            <strong>{timeUsed}</strong>
          </div>
        </div>

        {/* ========================================================= */}
        {/* UNIQUE PREPGO FEATURE: PLACEMENT READINESS ANALYSIS */}
        {/* ========================================================= */}
        <div className="readiness-analysis-section">
          <div className="readiness-header">
            <div className="readiness-tag">
              ✨ UNIQUE PREPGO FEATURE
            </div>
            <h2>Placement Readiness Analysis</h2>
            <p>
              AI-driven diagnostic mapping your algorithmic performance to company hiring bars.
            </p>
          </div>

          <div className="readiness-grid">
            {/* STRONG AREAS */}
            <div className="readiness-card strong-card">
              <div className="rc-title-row">
                <span className="rc-icon">💪</span>
                <h3>Strong Areas</h3>
              </div>
              <ul className="topics-list">
                {strongTopics.map((topic, i) => (
                  <li key={i} className="strong-topic-item">
                    <span className="check-icon">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NEEDS IMPROVEMENT */}
            <div className="readiness-card weak-card">
              <div className="rc-title-row">
                <span className="rc-icon">🎯</span>
                <h3>Needs Improvement</h3>
              </div>
              <ul className="topics-list">
                {weakTopics.map((topic, i) => (
                  <li key={i} className="weak-topic-item">
                    <span className="dot-icon">⚠️</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* TARGET COMPANY TIER */}
            <div className="readiness-card tier-card">
              <div className="rc-title-row">
                <span className="rc-icon">🏢</span>
                <h3>Recommended Company Tier</h3>
              </div>
              <div className="tier-content">
                <strong>{recommendedCompanyLevel}</strong>
              </div>
              <div className="next-topic-badge">
                <span>Suggested Next Topic:</span>
                <b>{suggestedNextTopic}</b>
              </div>
            </div>
          </div>

          {/* ACTIONABLE RECOMMENDATION BANNER */}
          <div className="actionable-recommendation-box">
            <div className="rec-bulb">💡</div>
            <div className="rec-text">
              <h4>Preparation Recommendation</h4>
              <p>{recommendation}</p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PROBLEM BREAKDOWN */}
        {/* ========================================================= */}
        {answers && answers.length > 0 && (
          <div className="dsa-breakdown-section">
            <h3>Problem Breakdown</h3>
            <div className="breakdown-list">
              {answers.map((ans, idx) => (
                <div
                  className={`breakdown-card ${ans.passed ? "passed" : "failed"}`}
                  key={idx}
                >
                  <div className="bc-header">
                    <div>
                      <span className="bc-q">Problem {idx + 1}:</span>
                      <strong className="bc-title">{ans.title}</strong>
                      <span className="bc-topic-pill">
                        Topic: {ans.topic || "DSA"}
                      </span>
                    </div>
                    <span className={`bc-status ${ans.passed ? "pass" : "fail"}`}>
                      {ans.passed ? "PASSED (30 / 30)" : "FAILED (0 / 30)"}
                    </span>
                  </div>

                  {ans.code && (
                    <div className="code-snippet-box">
                      <div className="code-snippet-header">
                        <span>Submitted Code ({language.toUpperCase()}):</span>
                      </div>
                      <pre>
                        <code>{ans.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="result-actions-row">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/dsa")}
          >
            🔄 Retake Test
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={() => navigate("/progress")}
          >
            📊 View Progress &amp; Reports →
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/home")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default DSAResult;
