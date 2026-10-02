import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Progress.css";

function Progress() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let storedUser = null;
    try {
      const stored = localStorage.getItem("prepgoUser");
      if (stored) {
        storedUser = JSON.parse(stored);
        setUser(storedUser);
      }
    } catch (e) {
      console.error("Error reading stored user:", e);
    }

    const fetchProgress = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("prepgoToken");
        const userId = storedUser?.id || storedUser?._id;

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = userId
          ? `http://localhost:5000/api/auth/progress?userId=${userId}`
          : `http://localhost:5000/api/auth/progress`;

        const res = await axios.get(url, { headers });
        if (res.data && res.data.success) {
          setAnalytics(res.data.data);
        } else {
          setError("Failed to load progress data.");
        }
      } catch (err) {
        console.error("Progress fetch error:", err);
        setError("Unable to connect to PrepGo analytics service.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const userName = user?.name || analytics?.user?.name || "Candidate";
  const metrics = analytics?.metrics || {};
  const difficulty = analytics?.difficultyBreakdown || {};
  const recentAttempts = analytics?.recentAttempts || [];
  const achievements = analytics?.achievements || [];
  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="progress-page">
      {/* ================= TOP NAVIGATION ================= */}
      <header className="progress-header">
        <div className="progress-header-inner">
          <div className="progress-brand" onClick={() => navigate("/home")}>
            <div className="progress-brand-logo">PG</div>
            <div className="progress-brand-text">
              <span className="progress-brand-name">PrepGo</span>
              <span className="progress-brand-tagline">Progress Dashboard</span>
            </div>
          </div>

          <nav className="progress-nav-tabs">
            <button
              type="button"
              className="progress-tab-btn active"
              onClick={() => navigate("/progress")}
            >
              📊 Progress
            </button>
            <button
              type="button"
              className="progress-tab-btn"
              onClick={() => navigate("/reports")}
            >
              📑 Reports
            </button>
            <button
              type="button"
              className="progress-tab-btn"
              onClick={() => navigate("/achievements")}
            >
              🏆 Achievements
            </button>
            <button
              type="button"
              className="progress-tab-btn"
              onClick={() => navigate("/profile")}
            >
              👤 Profile
            </button>
          </nav>

          <button
            type="button"
            className="progress-back-btn"
            onClick={() => navigate("/home")}
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="progress-main">
        {/* Welcome Section */}
        <section className="progress-hero">
          <div className="progress-hero-badge">PERFORMANCE TRACKER</div>
          <h1>{userName}'s Preparation Progress</h1>
          <p>
            Real metrics computed directly from your completed Aptitude and Technical DSA assessments.
          </p>
        </section>

        {loading ? (
          <div className="progress-loading-card">
            <div className="progress-spinner"></div>
            <p>Loading your verified attempt data from database...</p>
          </div>
        ) : error ? (
          <div className="progress-error-card">
            <p>⚠️ {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            {/* KPI METRICS OVERVIEW */}
            <div className="progress-kpi-grid">
              {/* CARD 1 */}
              <div className="kpi-card">
                <div className="kpi-icon-row">
                  <span className="kpi-label">TOTAL ASSESSMENTS</span>
                  <span className="kpi-icon">🎯</span>
                </div>
                <div className="kpi-value">{metrics.totalAssessments ?? 0}</div>
                <div className="kpi-subtext">
                  <span>{metrics.aptitudeAttempts ?? 0} Aptitude</span> •{" "}
                  <span>{metrics.dsaAttempts ?? 0} DSA</span>
                </div>
              </div>

              {/* CARD 2 */}
              <div className="kpi-card">
                <div className="kpi-icon-row">
                  <span className="kpi-label">QUESTIONS SOLVED</span>
                  <span className="kpi-icon">✅</span>
                </div>
                <div className="kpi-value">
                  {metrics.questionsSolved ?? 0}{" "}
                  <small>/ {metrics.questionsAttempted ?? 0}</small>
                </div>
                <div className="kpi-subtext">
                  Accuracy: <strong>{metrics.overallAccuracy !== "N/A" ? `${metrics.overallAccuracy}%` : "N/A"}</strong>
                </div>
              </div>

              {/* CARD 3 */}
              <div className="kpi-card">
                <div className="kpi-icon-row">
                  <span className="kpi-label">ROUND 1 BEST SCORE</span>
                  <span className="kpi-icon">📝</span>
                </div>
                <div className="kpi-value">
                  {metrics.aptitudeBestScore !== "N/A" ? `${metrics.aptitudeBestScore} / 60` : "N/A"}
                </div>
                <div className="kpi-subtext">
                  Average: {metrics.aptitudeAvgScore !== "N/A" ? `${metrics.aptitudeAvgScore} pts` : "N/A"}
                </div>
              </div>

              {/* CARD 4 */}
              <div className="kpi-card">
                <div className="kpi-icon-row">
                  <span className="kpi-label">ROUND 2 BEST SCORE</span>
                  <span className="kpi-icon">💻</span>
                </div>
                <div className="kpi-value">
                  {metrics.dsaBestScore !== "N/A" ? `${metrics.dsaBestScore} / 60` : "N/A"}
                </div>
                <div className="kpi-subtext">
                  Average: {metrics.dsaAvgScore !== "N/A" ? `${metrics.dsaAvgScore} pts` : "N/A"}
                </div>
              </div>
            </div>

            {/* MODULE PERFORMANCE SECTION */}
            <div className="progress-modules-grid">
              {/* ROUND 1 APTITUDE */}
              <div className="progress-module-card">
                <div className="pm-header">
                  <div className="pm-badge">ROUND 1</div>
                  <h3>Aptitude &amp; Reasoning</h3>
                </div>
                <p className="pm-desc">
                  Quantitative ability, logical reasoning, and verbal aptitude testing.
                </p>

                <div className="pm-stats-row">
                  <div className="pm-stat">
                    <span>Attempts</span>
                    <strong>{metrics.aptitudeAttempts ?? 0}</strong>
                  </div>
                  <div className="pm-stat">
                    <span>Avg Score</span>
                    <strong>{metrics.aptitudeAvgScore !== "N/A" ? `${metrics.aptitudeAvgScore} / 60` : "N/A"}</strong>
                  </div>
                  <div className="pm-stat">
                    <span>Best Score</span>
                    <strong>{metrics.aptitudeBestScore !== "N/A" ? `${metrics.aptitudeBestScore} / 60` : "N/A"}</strong>
                  </div>
                </div>

                <div className="difficulty-pills">
                  <div className="diff-pill">
                    <span className="diff-dot easy"></span> Easy: {difficulty.aptitude?.easy?.attempts || 0}
                  </div>
                  <div className="diff-pill">
                    <span className="diff-dot medium"></span> Medium: {difficulty.aptitude?.medium?.attempts || 0}
                  </div>
                  <div className="diff-pill">
                    <span className="diff-dot hard"></span> Hard: {difficulty.aptitude?.hard?.attempts || 0}
                  </div>
                </div>

                <button
                  type="button"
                  className="pm-action-btn"
                  onClick={() => navigate("/aptitude")}
                >
                  Practice Aptitude →
                </button>
              </div>

              {/* ROUND 2 DSA */}
              <div className="progress-module-card">
                <div className="pm-header">
                  <div className="pm-badge">ROUND 2</div>
                  <h3>Technical &amp; DSA Coding</h3>
                </div>
                <p className="pm-desc">
                  Data structures, algorithmic problem solving, and multi-language compilation.
                </p>

                <div className="pm-stats-row">
                  <div className="pm-stat">
                    <span>Attempts</span>
                    <strong>{metrics.dsaAttempts ?? 0}</strong>
                  </div>
                  <div className="pm-stat">
                    <span>Avg Score</span>
                    <strong>{metrics.dsaAvgScore !== "N/A" ? `${metrics.dsaAvgScore} / 60` : "N/A"}</strong>
                  </div>
                  <div className="pm-stat">
                    <span>Best Score</span>
                    <strong>{metrics.dsaBestScore !== "N/A" ? `${metrics.dsaBestScore} / 60` : "N/A"}</strong>
                  </div>
                </div>

                <div className="difficulty-pills">
                  <div className="diff-pill">
                    <span className="diff-dot easy"></span> Easy: {difficulty.dsa?.easy?.attempts || 0}
                  </div>
                  <div className="diff-pill">
                    <span className="diff-dot medium"></span> Medium: {difficulty.dsa?.medium?.attempts || 0}
                  </div>
                  <div className="diff-pill">
                    <span className="diff-dot hard"></span> Hard: {difficulty.dsa?.hard?.attempts || 0}
                  </div>
                </div>

                <button
                  type="button"
                  className="pm-action-btn"
                  onClick={() => navigate("/dsa")}
                >
                  Practice DSA Coding →
                </button>
              </div>
            </div>

            {/* QUICK NAVIGATION CARDS */}
            <div className="progress-quick-cards">
              <div className="quick-card" onClick={() => navigate("/reports")}>
                <div className="qc-icon">📑</div>
                <div className="qc-content">
                  <h4>Detailed Performance Reports</h4>
                  <p>In-depth breakdown by difficulty, accuracy, and chronological attempt history.</p>
                </div>
                <span className="qc-arrow">→</span>
              </div>

              <div className="quick-card" onClick={() => navigate("/achievements")}>
                <div className="qc-icon">🏆</div>
                <div className="qc-content">
                  <h4>Achievements &amp; Badges</h4>
                  <p>{unlockedAchievementsCount} of {achievements.length} achievements unlocked based on your practice.</p>
                </div>
                <span className="qc-arrow">→</span>
              </div>
            </div>

            {/* RECENT ATTEMPTS TABLE */}
            <div className="progress-recent-section">
              <div className="prs-header">
                <h3>Recent Assessment Sessions</h3>
                <button
                  type="button"
                  className="prs-view-all"
                  onClick={() => navigate("/reports")}
                >
                  View Full Reports →
                </button>
              </div>

              {recentAttempts.length === 0 ? (
                <div className="prs-empty">
                  <p>No assessment sessions recorded yet.</p>
                  <span>Start a practice test in Round 1 or Round 2 to see your real-time analytics.</span>
                </div>
              ) : (
                <div className="prs-table-wrap">
                  <table className="prs-table">
                    <thead>
                      <tr>
                        <th>Module</th>
                        <th>Difficulty</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Details</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAttempts.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.module}</strong></td>
                          <td>
                            <span className={`diff-tag ${(item.difficulty || "").toLowerCase()}`}>
                              {item.difficulty?.toUpperCase()}
                            </span>
                          </td>
                          <td>{item.score} / {item.maxScore}</td>
                          <td>
                            <strong className={item.percentage >= 60 ? "score-high" : "score-mid"}>
                              {item.percentage}%
                            </strong>
                          </td>
                          <td>{item.details}</td>
                          <td className="date-cell">
                            {new Date(item.date).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="progress-footer">
        <span>© {new Date().getFullYear()} PrepGo. Placement Readiness System.</span>
      </footer>
    </div>
  );
}

export default Progress;
