import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DSAHome.css";

function DSAHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("prepgoUser");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const tracks = [
    {
      level: "easy",
      name: "Easy Mode",
      colorClass: "easy",
      questionsCount: 2,
      marks: 60,
      time: "15–25 Minutes",
      badge: "BEGINNER LEVEL",
      languages: "Python, C, C++, Java",
      topics: ["Arrays", "Strings", "Searching", "Hash Tables", "Sorting"],
    },
    {
      level: "medium",
      name: "Medium Mode",
      colorClass: "medium",
      questionsCount: 2,
      marks: 60,
      time: "30–45 Minutes",
      badge: "INTERMEDIATE LEVEL",
      languages: "Python, C, C++, Java",
      topics: [
        "Strings",
        "Dynamic Programming",
        "Sorting",
        "Hash Tables",
        "Trees",
        "Graphs",
      ],
    },
    {
      level: "hard",
      name: "Hard Mode",
      colorClass: "hard",
      questionsCount: 2,
      marks: 60,
      time: "45–60 Minutes",
      badge: "ADVANCED LEVEL",
      languages: "Python, C, C++, Java",
      topics: [
        "Dynamic Programming",
        "Trees",
        "Graphs",
        "Arrays",
        "Searching",
      ],
    },
  ];

  return (
    <div className="dsa-home-page">
      {/* ================= TOP NAVBAR ================= */}
      <header className="dsa-navbar">
        <div className="dsa-nav-left" onClick={() => navigate("/home")}>
          <div className="dsa-logo-badge">PG</div>
          <div className="dsa-nav-title">
            <h2>PrepGo</h2>
            <span>Round 2 — DSA Technical Assessment</span>
          </div>
        </div>

        <div className="dsa-nav-center">
          <div className="nav-metric">
            <span className="metric-label">TOTAL TIME</span>
            <span className="metric-val">⏱️ 15–60 Mins</span>
          </div>
          <div className="metric-divider"></div>
          <div className="nav-metric">
            <span className="metric-label">TOTAL MARKS</span>
            <span className="metric-val">🏆 60 Marks</span>
          </div>
        </div>

        <div className="dsa-nav-right">
          <button className="back-dashboard-btn" onClick={() => navigate("/home")}>
            ← Dashboard
          </button>
          <div className="candidate-profile">
            <div className="candidate-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "H"}
            </div>
            <div className="candidate-info">
              <strong>{user?.name || "Candidate"}</strong>
              <span>Student</span>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="dsa-main-container">
        <div className="dsa-hero-header">
          <span className="sub-badge">ROUND 02 • TECHNICAL CODING ROUND</span>
          <h1>Data Structures & Algorithms</h1>
          <p>
            Demonstrate your algorithmic problem solving across 4 industry languages: 
            <strong> Python, C, C++, and Java</strong>. Every attempt randomly selects 2 algorithmic challenges.
          </p>
        </div>

        {/* 3 DIFFICULTY CARDS */}
        <div className="dsa-cards-grid">
          {tracks.map((track) => (
            <div className={`dsa-card ${track.colorClass}`} key={track.level}>
              <div className="card-top-header">
                <span className="mode-badge">{track.badge}</span>
                <span className="timer-badge">⏱️ {track.time}</span>
              </div>

              <h2>{track.name}</h2>

              <div className="dsa-metrics-row">
                <div className="metric-box">
                  <span className="m-label">Questions</span>
                  <span className="m-value">📝 {track.questionsCount} Random</span>
                </div>
                <div className="metric-box">
                  <span className="m-label">Marks</span>
                  <span className="m-value">🏆 {track.marks} Marks</span>
                </div>
                <div className="metric-box">
                  <span className="m-label">Languages</span>
                  <span className="m-value">💻 Multi-Lang</span>
                </div>
              </div>

              <div className="lang-support-pill">
                <span>Supported: </span>
                <strong>{track.languages}</strong>
              </div>

              {/* TOPICS COVERED SECTION (No question titles revealed) */}
              <div className="topics-preview-box">
                <span className="topics-title">TOPICS COVERED:</span>
                <div className="topics-tags-grid">
                  {track.topics.map((t) => (
                    <span className="topic-chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* REVEAL NOTE */}
              <div className="reveal-notice-box">
                <span className="lock-icon">🔒</span>
                <p>Questions will be revealed only after starting the assessment.</p>
              </div>

              <button
                className="start-mode-btn"
                onClick={() => navigate(`/dsa/instructions/${track.level}`)}
              >
                Start {track.name} →
              </button>
            </div>
          ))}
        </div>

        {/* BOTTOM TIP SECTION */}
        <section className="dsa-tip-section">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <h4>Assessment Strategy Tip</h4>
            <p>
              Manage your time wisely and test your code against sample test cases using <strong>▶ Run Code</strong> before final submission. After completion, PrepGo provides an automated <strong>Placement Readiness Analysis</strong> to help guide your preparation.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DSAHome;
