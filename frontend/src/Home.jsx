import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("prepgoUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Error reading stored user:", e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("prepgoToken");
    localStorage.removeItem("prepgoUser");
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleProgressClick = () => {
    navigate("/progress");
  };

  const userName = user?.name || "Candidate";

  return (
    <div className="dash-container">
      {/* ================= TOP NAVIGATION ================= */}
      <header className="dash-header">
        <div className="dash-header-inner">
          {/* Left: PrepGo logo and tagline */}
          <div className="dash-brand" onClick={() => navigate("/home")}>
            <div className="dash-brand-logo">PG</div>
            <div className="dash-brand-text">
              <span className="dash-brand-name">PrepGo</span>
              <span className="dash-brand-tagline">Where Practice Meets Opportunity</span>
            </div>
          </div>

          {/* Navigation Items: Horizontal list */}
          <nav className="dash-nav-items">
            <button
              type="button"
              className="dash-nav-btn"
              onClick={() => navigate("/aptitude")}
            >
              <span className="dash-nav-num">01</span> Round 1
            </button>

            <button
              type="button"
              className="dash-nav-btn"
              onClick={() => navigate("/dsa")}
            >
              <span className="dash-nav-num">02</span> Round 2
            </button>

            <button
              type="button"
              className="dash-nav-btn nav-btn-muted"
              onClick={() => alert("Round 3 (HR Interview) is coming soon!")}
            >
              <span className="dash-nav-num">03</span> Round 3
            </button>

            <button
              type="button"
              className="dash-nav-btn"
              onClick={handleProfileClick}
            >
              Profile
            </button>

            <button
              type="button"
              className="dash-nav-btn"
              onClick={handleProgressClick}
            >
              Progress
            </button>

            <button
              type="button"
              className="dash-nav-btn"
              onClick={() => navigate("/reports")}
            >
              Reports
            </button>

            <button
              type="button"
              className="dash-nav-btn"
              onClick={() => navigate("/achievements")}
            >
              Achievements
            </button>
          </nav>

          {/* Right: User Profile & Logout */}
          <div className="dash-user-actions">
            <div
              className="dash-user-badge"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
              title="View & Edit Profile"
            >
              <div className="dash-user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="dash-user-name">{userName}</span>
            </div>

            <button
              type="button"
              className="dash-logout-btn"
              onClick={handleLogout}
              title="Log out of PrepGo"
            >
              Logout
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="dash-menu-toggle"
              aria-label="Toggle navigation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="dash-mobile-nav">
            <button
              type="button"
              className="dash-mobile-btn"
              onClick={() => { setMobileMenuOpen(false); navigate("/aptitude"); }}
            >
              <span>01</span> Round 1 (Aptitude)
            </button>
            <button
              type="button"
              className="dash-mobile-btn"
              onClick={() => { setMobileMenuOpen(false); navigate("/dsa"); }}
            >
              <span>02</span> Round 2 (Technical / DSA)
            </button>
            <button
              type="button"
              className="dash-mobile-btn muted"
              onClick={() => { setMobileMenuOpen(false); alert("Round 3 (HR Interview) is coming soon!"); }}
            >
              <span>03</span> Round 3 (HR Interview - Coming Soon)
            </button>
            <button
              type="button"
              className="dash-mobile-btn"
              onClick={() => { setMobileMenuOpen(false); handleProfileClick(); }}
            >
              Profile & Settings
            </button>
            <button
              type="button"
              className="dash-mobile-btn"
              onClick={() => { setMobileMenuOpen(false); handleProgressClick(); }}
            >
              Progress Dashboard
            </button>
            <button
              type="button"
              className="dash-mobile-btn"
              onClick={() => { setMobileMenuOpen(false); navigate("/reports"); }}
            >
              Performance Reports
            </button>
            <button
              type="button"
              className="dash-mobile-btn"
              onClick={() => { setMobileMenuOpen(false); navigate("/achievements"); }}
            >
              Milestones &amp; Badges
            </button>
            <button
              type="button"
              className="dash-mobile-btn logout"
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
            >
              Log Out
            </button>
          </div>
        )}
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="dash-main">
        {/* ================= WELCOME SECTION ================= */}
        <section className="dash-welcome-section">
          <div className="dash-welcome-label">
            PREPGO INTERVIEW PREPARATION
          </div>

          <h1 className="dash-welcome-title">
            Good Morning, {userName} 👋
          </h1>

          <p className="dash-welcome-subtitle">
            Ready to continue your interview preparation?
          </p>
        </section>

        {/* ================= MAIN MODULE SECTION ================= */}
        <section className="dash-modules-section">
          <div className="dash-section-header">
            <span className="dash-section-tag">EXPLORE PREPGO</span>
            <h2 className="dash-section-title">Interview Preparation Modules</h2>
            <p className="dash-section-subtitle">
              Prepare step by step and become interview ready.
            </p>
          </div>

          {/* FIVE MODULE CARDS IN ONE ROW (ON DESKTOP) */}
          <div className="dash-modules-grid">
            {/* CARD 1 — ROUND 1 */}
            <div
              className="dash-module-card"
              onClick={() => navigate("/aptitude")}
            >
              <div className="module-card-top">
                <span className="module-label">01 &nbsp; Round 1</span>
              </div>

              <h3 className="module-title">Aptitude &amp; Reasoning</h3>

              <p className="module-description">
                Practice quantitative aptitude, logical reasoning, and verbal ability. Improve your speed, accuracy, and problem-solving skills.
              </p>

              <div className="module-card-bottom">
                <span className="module-link-btn">
                  Explore Module →
                </span>
              </div>
            </div>

            {/* CARD 2 — ROUND 2 */}
            <div
              className="dash-module-card"
              onClick={() => navigate("/dsa")}
            >
              <div className="module-card-top">
                <span className="module-label">02 &nbsp; Round 2</span>
              </div>

              <h3 className="module-title">Technical Interview</h3>

              <p className="module-description">
                Prepare programming, data structures, algorithms, and core computer science concepts through technical interview practice.
              </p>

              <div className="module-card-bottom">
                <span className="module-link-btn">
                  Explore Module →
                </span>
              </div>
            </div>

            {/* CARD 3 — ROUND 3 (COMING SOON) */}
            <div className="dash-module-card card-disabled">
              <div className="module-card-top">
                <span className="module-label muted">03 &nbsp; Round 3</span>
                <span className="badge-coming-soon">Coming Soon</span>
              </div>

              <h3 className="module-title">HR Interview</h3>

              <p className="module-description">
                Practice HR and behavioral questions, improve communication, and learn how to confidently answer common interview questions.
              </p>

              <div className="module-card-bottom">
                <span className="module-btn-disabled">
                  Coming Soon
                </span>
              </div>
            </div>

            {/* CARD 4 — PROFILE */}
            <div
              className="dash-module-card"
              onClick={handleProfileClick}
            >
              <div className="module-card-top">
                <div className="module-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span className="module-label">Profile</span>
              </div>

              <h3 className="module-title">Profile &amp; Settings</h3>

              <p className="module-description">
                Manage your personal details, education, skill level, target role, and account preferences in one place.
              </p>

              <div className="module-card-bottom">
                <span className="module-link-btn">
                  Manage Profile →
                </span>
              </div>
            </div>

            {/* CARD 5 — PROGRESS */}
            <div
              className="dash-module-card"
              onClick={handleProgressClick}
            >
              <div className="module-card-top">
                <div className="module-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <span className="module-label">Progress</span>
              </div>

              <h3 className="module-title">Progress Dashboard</h3>

              <p className="module-description">
                Track your scores, completed practice sessions, round-wise performance, and skill improvement.
              </p>

              <div className="module-card-bottom">
                <span className="module-link-btn">
                  View Progress →
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= MINIMAL FOOTER ================= */}
      <footer className="dash-footer">
        <span>© {new Date().getFullYear()} PrepGo. Where Practice Meets Opportunity.</span>
      </footer>
    </div>
  );
}

export default Home;
