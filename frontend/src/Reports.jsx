import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Reports.css";

function Reports() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'aptitude' | 'dsa'
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

    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("prepgoToken");
        const userId = storedUser?.id || storedUser?._id;

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = userId
          ? `http://localhost:5000/api/auth/reports?userId=${userId}`
          : `http://localhost:5000/api/auth/reports`;

        const res = await axios.get(url, { headers });
        if (res.data && res.data.success) {
          setAnalytics(res.data.data);
        } else {
          setError("Failed to load reports data.");
        }
      } catch (err) {
        console.error("Reports fetch error:", err);
        setError("Unable to connect to PrepGo analytics service.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const userName = user?.name || analytics?.user?.name || "Candidate";
  const metrics = analytics?.metrics || {};
  const diff = analytics?.difficultyBreakdown || {};
  const allAttempts = analytics?.recentAttempts || [];
  const languagesUsed = analytics?.languagesUsed || [];

  const filteredAttempts = allAttempts.filter((att) => {
    if (activeFilter === "aptitude") return att.module.includes("Aptitude");
    if (activeFilter === "dsa") return att.module.includes("DSA");
    return true;
  });

  return (
    <div className="reports-page">
      {/* ================= TOP NAVIGATION ================= */}
      <header className="reports-header">
        <div className="reports-header-inner">
          <div className="reports-brand" onClick={() => navigate("/home")}>
            <div className="reports-brand-logo">PG</div>
            <div className="reports-brand-text">
              <span className="reports-brand-name">PrepGo</span>
              <span className="reports-brand-tagline">Assessment Reports</span>
            </div>
          </div>

          <nav className="reports-nav-tabs">
            <button
              type="button"
              className="reports-tab-btn"
              onClick={() => navigate("/progress")}
            >
              📊 Progress
            </button>
            <button
              type="button"
              className="reports-tab-btn active"
              onClick={() => navigate("/reports")}
            >
              📑 Reports
            </button>
            <button
              type="button"
              className="reports-tab-btn"
              onClick={() => navigate("/achievements")}
            >
              🏆 Achievements
            </button>
            <button
              type="button"
              className="reports-tab-btn"
              onClick={() => navigate("/profile")}
            >
              👤 Profile
            </button>
          </nav>

          <button
            type="button"
            className="reports-back-btn"
            onClick={() => navigate("/home")}
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="reports-main">
        <section className="reports-hero">
          <div className="reports-hero-badge">OFFICIAL ATTEMPT REPORT</div>
          <h1>{userName}'s Performance Report</h1>
          <p>
            Detailed analysis of your practice evaluations, accuracy benchmarks, and score histories.
          </p>
        </section>

        {loading ? (
          <div className="reports-loading-card">
            <div className="reports-spinner"></div>
            <p>Compiling assessment records from database...</p>
          </div>
        ) : error ? (
          <div className="reports-error-card">
            <p>⚠️ {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            {/* COMPARISON METRICS SUMMARY */}
            <div className="reports-summary-row">
              {/* APTITUDE REPORT CARD */}
              <div className="report-summary-card">
                <div className="rsc-header">
                  <span className="rsc-tag aptitude">ROUND 1</span>
                  <h3>Aptitude Evaluation Report</h3>
                </div>
                <div className="rsc-metrics-grid">
                  <div className="rsc-item">
                    <span>Total Attempts</span>
                    <strong>{metrics.aptitudeAttempts ?? 0}</strong>
                  </div>
                  <div className="rsc-item">
                    <span>Average Score</span>
                    <strong>{metrics.aptitudeAvgScore !== "N/A" ? `${metrics.aptitudeAvgScore} / 60` : "N/A"}</strong>
                  </div>
                  <div className="rsc-item">
                    <span>Highest Score</span>
                    <strong className="green">{metrics.aptitudeBestScore !== "N/A" ? `${metrics.aptitudeBestScore} / 60` : "N/A"}</strong>
                  </div>
                  <div className="rsc-item">
                    <span>Average Accuracy</span>
                    <strong>{metrics.aptitudeAvgPercentage !== "N/A" ? `${metrics.aptitudeAvgPercentage}%` : "N/A"}</strong>
                  </div>
                </div>
              </div>

              {/* TECHNICAL DSA REPORT CARD */}
              <div className="report-summary-card">
                <div className="rsc-header">
                  <span className="rsc-tag dsa">ROUND 2</span>
                  <h3>Technical DSA Report</h3>
                </div>
                <div className="rsc-metrics-grid">
                  <div className="rsc-item">
                    <span>Total Coding Attempts</span>
                    <strong>{metrics.dsaAttempts ?? 0}</strong>
                  </div>
                  <div className="rsc-item">
                    <span>Average Score</span>
                    <strong>{metrics.dsaAvgScore !== "N/A" ? `${metrics.dsaAvgScore} / 60` : "N/A"}</strong>
                  </div>
                  <div className="rsc-item">
                    <span>Highest Score</span>
                    <strong className="green">{metrics.dsaBestScore !== "N/A" ? `${metrics.dsaBestScore} / 60` : "N/A"}</strong>
                  </div>
                  <div className="rsc-item">
                    <span>Languages Tested</span>
                    <strong className="rsc-lang-list">
                      {languagesUsed.length > 0 ? languagesUsed.map(l => l.toUpperCase()).join(", ") : "None"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* DIFFICULTY-WISE PERFORMANCE BREAKDOWN */}
            <section className="difficulty-breakdown-section">
              <div className="section-title-row">
                <h2>Difficulty-Wise Performance Breakdown</h2>
                <span className="section-subtitle">Real attempt distribution across difficulty tiers</span>
              </div>

              <div className="diff-cards-grid">
                {/* EASY TIER */}
                <div className="diff-card">
                  <div className="diff-card-header easy">
                    <span className="dc-dot"></span>
                    <h4>Easy Tier</h4>
                  </div>
                  <div className="diff-card-body">
                    <div className="dc-row">
                      <span>Round 1 Aptitude:</span>
                      <strong>{diff.aptitude?.easy?.attempts || 0} attempts (Best: {diff.aptitude?.easy?.bestScore || 0}/60)</strong>
                    </div>
                    <div className="dc-row">
                      <span>Round 2 DSA:</span>
                      <strong>{diff.dsa?.easy?.attempts || 0} attempts (Best: {diff.dsa?.easy?.bestScore || 0}/60)</strong>
                    </div>
                  </div>
                </div>

                {/* MEDIUM TIER */}
                <div className="diff-card">
                  <div className="diff-card-header medium">
                    <span className="dc-dot"></span>
                    <h4>Medium Tier</h4>
                  </div>
                  <div className="diff-card-body">
                    <div className="dc-row">
                      <span>Round 1 Aptitude:</span>
                      <strong>{diff.aptitude?.medium?.attempts || 0} attempts (Best: {diff.aptitude?.medium?.bestScore || 0}/60)</strong>
                    </div>
                    <div className="dc-row">
                      <span>Round 2 DSA:</span>
                      <strong>{diff.dsa?.medium?.attempts || 0} attempts (Best: {diff.dsa?.medium?.bestScore || 0}/60)</strong>
                    </div>
                  </div>
                </div>

                {/* HARD TIER */}
                <div className="diff-card">
                  <div className="diff-card-header hard">
                    <span className="dc-dot"></span>
                    <h4>Hard Tier</h4>
                  </div>
                  <div className="diff-card-body">
                    <div className="dc-row">
                      <span>Round 1 Aptitude:</span>
                      <strong>{diff.aptitude?.hard?.attempts || 0} attempts (Best: {diff.aptitude?.hard?.bestScore || 0}/60)</strong>
                    </div>
                    <div className="dc-row">
                      <span>Round 2 DSA:</span>
                      <strong>{diff.dsa?.hard?.attempts || 0} attempts (Best: {diff.dsa?.hard?.bestScore || 0}/60)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ATTEMPT HISTORY LOG */}
            <section className="attempts-history-section">
              <div className="history-header">
                <h2>Assessment Session History</h2>
                <div className="filter-pill-group">
                  <button
                    type="button"
                    className={`filter-pill ${activeFilter === "all" ? "active" : ""}`}
                    onClick={() => setActiveFilter("all")}
                  >
                    All ({allAttempts.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${activeFilter === "aptitude" ? "active" : ""}`}
                    onClick={() => setActiveFilter("aptitude")}
                  >
                    Round 1 Aptitude ({metrics.aptitudeAttempts ?? 0})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${activeFilter === "dsa" ? "active" : ""}`}
                    onClick={() => setActiveFilter("dsa")}
                  >
                    Round 2 DSA ({metrics.dsaAttempts ?? 0})
                  </button>
                </div>
              </div>

              {filteredAttempts.length === 0 ? (
                <div className="history-empty">
                  <p>No assessment attempts found for this filter.</p>
                  <button onClick={() => navigate("/home")}>Go to Dashboard to Start Practicing</button>
                </div>
              ) : (
                <div className="history-table-container">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Assessment Module</th>
                        <th>Difficulty</th>
                        <th>Language</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Details</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttempts.map((att, idx) => (
                        <tr key={att.id}>
                          <td>{idx + 1}</td>
                          <td><strong>{att.module}</strong></td>
                          <td>
                            <span className={`diff-badge ${(att.difficulty || "").toLowerCase()}`}>
                              {att.difficulty?.toUpperCase()}
                            </span>
                          </td>
                          <td>{att.language ? att.language.toUpperCase() : "N/A"}</td>
                          <td><strong>{att.score}</strong> / {att.maxScore}</td>
                          <td>
                            <span className={`perc-badge ${att.percentage >= 60 ? "good" : "avg"}`}>
                              {att.percentage}%
                            </span>
                          </td>
                          <td>{att.details}</td>
                          <td className="time-cell">
                            {new Date(att.date).toLocaleString(undefined, {
                              year: "numeric",
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
            </section>
          </>
        )}
      </main>

      <footer className="reports-footer">
        <span>© {new Date().getFullYear()} PrepGo. Assessment &amp; Placement Report System.</span>
      </footer>
    </div>
  );
}

export default Reports;
