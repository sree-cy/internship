import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Achievements.css";

function Achievements() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all' | 'unlocked' | 'locked'
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

    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("prepgoToken");
        const userId = storedUser?.id || storedUser?._id;

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = userId
          ? `http://localhost:5000/api/auth/achievements?userId=${userId}`
          : `http://localhost:5000/api/auth/achievements`;

        const res = await axios.get(url, { headers });
        if (res.data && res.data.success) {
          setAnalytics(res.data.data);
        } else {
          setError("Failed to load achievements data.");
        }
      } catch (err) {
        console.error("Achievements fetch error:", err);
        setError("Unable to connect to PrepGo analytics service.");
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const userName = user?.name || analytics?.user?.name || "Candidate";
  const achievements = analytics?.achievements || [];
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const filteredAchievements = achievements.filter((a) => {
    if (filter === "unlocked") return a.unlocked;
    if (filter === "locked") return !a.unlocked;
    return true;
  });

  return (
    <div className="achievements-page">
      {/* ================= TOP NAVIGATION ================= */}
      <header className="achievements-header">
        <div className="achievements-header-inner">
          <div className="achievements-brand" onClick={() => navigate("/home")}>
            <div className="achievements-brand-logo">PG</div>
            <div className="achievements-brand-text">
              <span className="achievements-brand-name">PrepGo</span>
              <span className="achievements-brand-tagline">Milestones &amp; Badges</span>
            </div>
          </div>

          <nav className="achievements-nav-tabs">
            <button
              type="button"
              className="achievements-tab-btn"
              onClick={() => navigate("/progress")}
            >
              📊 Progress
            </button>
            <button
              type="button"
              className="achievements-tab-btn"
              onClick={() => navigate("/reports")}
            >
              📑 Reports
            </button>
            <button
              type="button"
              className="achievements-tab-btn active"
              onClick={() => navigate("/achievements")}
            >
              🏆 Achievements
            </button>
            <button
              type="button"
              className="achievements-tab-btn"
              onClick={() => navigate("/profile")}
            >
              👤 Profile
            </button>
          </nav>

          <button
            type="button"
            className="achievements-back-btn"
            onClick={() => navigate("/home")}
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="achievements-main">
        <section className="achievements-hero">
          <div className="achievements-hero-badge">ACTIVITY REWARDS</div>
          <h1>{userName}'s Earned Achievements</h1>
          <p>
            Badges awarded strictly based on your actual practice assessments and coding submissions.
          </p>
        </section>

        {loading ? (
          <div className="achievements-loading-card">
            <div className="achievements-spinner"></div>
            <p>Evaluating achievements against your database activity...</p>
          </div>
        ) : error ? (
          <div className="achievements-error-card">
            <p>⚠️ {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            {/* OVERALL PROGRESS BANNER */}
            <div className="achievements-banner">
              <div className="banner-left">
                <span className="banner-tag">MILESTONE TRACKER</span>
                <h2>
                  {unlockedCount} of {totalCount} Badges Unlocked
                </h2>
                <p>
                  {unlockedCount === totalCount
                    ? "Incredible! You have unlocked every milestone on PrepGo."
                    : "Complete more aptitude and DSA technical assessments to unlock the remaining badges."}
                </p>
              </div>
              <div className="banner-right">
                <div className="banner-progress-circle">
                  <strong>{completionPercentage}%</strong>
                  <span>COMPLETED</span>
                </div>
              </div>
            </div>

            {/* FILTER CONTROLS */}
            <div className="achievements-controls-row">
              <div className="achievements-filters">
                <button
                  type="button"
                  className={`filter-btn ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All ({totalCount})
                </button>
                <button
                  type="button"
                  className={`filter-btn ${filter === "unlocked" ? "active" : ""}`}
                  onClick={() => setFilter("unlocked")}
                >
                  ✓ Unlocked ({unlockedCount})
                </button>
                <button
                  type="button"
                  className={`filter-btn ${filter === "locked" ? "active" : ""}`}
                  onClick={() => setFilter("locked")}
                >
                  🔒 Locked ({totalCount - unlockedCount})
                </button>
              </div>
            </div>

            {/* ACHIEVEMENTS GRID */}
            <div className="achievements-grid">
              {filteredAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`achievement-card ${ach.unlocked ? "unlocked" : "locked"}`}
                >
                  <div className="ach-card-top">
                    <div className="ach-icon-box">{ach.icon}</div>
                    <span className={`ach-status-badge ${ach.unlocked ? "badge-unlocked" : "badge-locked"}`}>
                      {ach.unlocked ? "✓ Unlocked" : "🔒 In Progress"}
                    </span>
                  </div>

                  <div className="ach-content">
                    <span className="ach-category">{ach.category}</span>
                    <h3 className="ach-title">{ach.title}</h3>
                    <p className="ach-desc">{ach.description}</p>
                  </div>

                  <div className="ach-card-footer">
                    {ach.unlocked ? (
                      <span className="ach-unlocked-date">
                        Earned:{" "}
                        {ach.unlockedAt
                          ? new Date(ach.unlockedAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Activity Verified"}
                      </span>
                    ) : (
                      <span className="ach-locked-hint">
                        Target: {ach.progress || "Incomplete"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* MOTIVATION CALL TO ACTION */}
            <div className="achievements-cta-box">
              <div className="cta-text">
                <h3>Ready to unlock more achievements?</h3>
                <p>Sharpen your problem solving in Round 1 or submit code in Round 2.</p>
              </div>
              <div className="cta-actions">
                <button
                  type="button"
                  className="cta-btn secondary"
                  onClick={() => navigate("/aptitude")}
                >
                  Practice Aptitude
                </button>
                <button
                  type="button"
                  className="cta-btn primary"
                  onClick={() => navigate("/dsa")}
                >
                  Practice DSA Coding
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="achievements-footer">
        <span>© {new Date().getFullYear()} PrepGo. Activity &amp; Milestone System.</span>
      </footer>
    </div>
  );
}

export default Achievements;
