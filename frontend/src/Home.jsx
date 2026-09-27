import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [latestAttempt, setLatestAttempt] = useState(null);
  const [latestDSAAttempt, setLatestDSAAttempt] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("prepgoUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Error reading stored user:", e);
    }

    const fetchLatestAttempts = async () => {
      try {
        const [aptRes, dsaRes] = await Promise.all([
          fetch("http://localhost:5000/api/aptitude/latest-attempt").then((r) => r.json()),
          fetch("http://localhost:5000/api/dsa/latest-attempt").then((r) => r.json()),
        ]);

        if (aptRes.success && aptRes.attempt) {
          setLatestAttempt(aptRes.attempt);
        }
        if (dsaRes.success && dsaRes.attempt) {
          setLatestDSAAttempt(dsaRes.attempt);
        }
      } catch (err) {
        console.error("Failed to load latest attempts:", err);
      }
    };

    fetchLatestAttempts();
  }, []);

  return (
    <div className="home-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-box">PG</div>

          <div>
            <h2>PrepGo</h2>
            <p>Practice Meets Opportunity</p>
          </div>
        </div>


        <div className="menu">

          <button className="menu-item active">
            🏠
            <span>Dashboard</span>
          </button>

          <button className="menu-item">
            🎯
            <span>Interviews</span>
          </button>

          <button className="menu-item">
            📊
            <span>My Progress</span>
          </button>

          <button className="menu-item">
            🎓
            <span>Skill Development</span>
          </button>

          <button className="menu-item">
            📄
            <span>Reports</span>
          </button>

          <button className="menu-item">
            🏆
            <span>Achievements</span>
          </button>

          <button className="menu-item">
            ⚙️
            <span>Settings</span>
          </button>

        </div>


        <div className="sidebar-bottom">

          <div className="help-box">

            <h4>Need Help?</h4>

            <p>
              Improve your interview skills
              with PrepGo.
            </p>

            <button>
              Get Support
            </button>

          </div>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">

        {/* TOP BAR */}

        <header className="topbar">

          <div>
            <h3>Dashboard</h3>
            <p>Track your interview preparation</p>
          </div>


          <div className="profile">

            <div className="notification">
              🔔
            </div>

            <div className="profile-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : "H"}
            </div>

            <div className="profile-details">
              <strong>{user?.name || "Hema"}</strong>
              <span>{user?.email || "Student"}</span>
            </div>

          </div>

        </header>


        {/* WELCOME CARD */}

        <section className="welcome-card">

          <div className="welcome-text">

            <span className="small-label">
              🚀 KEEP LEARNING
            </span>

            <h1>
              Welcome to PrepGo!
            </h1>

            <p>
              Where Practice Meets Opportunity.
              <br />
              Prepare yourself for your dream interview.
            </p>

            {/* CONNECTED TO APTITUDE ROUND 1 */}
            <button
              onClick={() => navigate("/aptitude")}
              className="practice-button"
            >
              Start Practicing →
            </button>

          </div>


          <div className="welcome-icon">
            🤖
          </div>

        </section>


        {/* STATISTICS */}

        <section className="stats-section">

          <div className="stat-card">

            <div className="stat-icon purple">
              🎯
            </div>

            <div>
              <h2>12</h2>
              <p>Interviews Taken</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon green">
              📈
            </div>

            <div>
              <h2>78%</h2>
              <p>Average Score</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon orange">
              ⭐
            </div>

            <div>
              <h2>7</h2>
              <p>Skills Improved</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon blue">
              ⏱️
            </div>

            <div>
              <h2>24h</h2>
              <p>Time Practiced</p>
            </div>

          </div>

        </section>


        {/* INTERVIEW ROUNDS */}

        <section className="round-section">

          <div className="section-heading">

            <div>

              <h2>Your Interview Journey</h2>

              <p>
                Complete all three rounds to improve
                your interview readiness.
              </p>

            </div>

          </div>


          <div className="rounds">


            {/* ================= ROUND 1 ================= */}

            <div className="round-card round-one">

              <div className="round-number">
                01
              </div>

              <span className="round-status">
                BASIC
              </span>

              <h3>Round 1</h3>

              <h4>Basic Screening</h4>

              <p>
                Test your aptitude, logical reasoning
                and basic technical knowledge.
              </p>

              <div className="round-info">
                <span>📝 20 Questions</span>
                <span>⏱️ 20 Minutes</span>
              </div>

              {latestAttempt && (
                <div className="latest-attempt-box">
                  <div className="attempt-badge-header">
                    <span className="attempt-tag">LATEST ATTEMPT</span>
                    <span className="attempt-date">
                      {new Date(latestAttempt.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="attempt-metrics">
                    <div>
                      <strong>Difficulty:</strong>{" "}
                      <span className="diff-pill">
                        {latestAttempt.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <strong>Score:</strong> {latestAttempt.score} / 60
                    </div>
                    <div>
                      <strong>Percentage:</strong>{" "}
                      <span className="perc-pill">
                        {latestAttempt.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CONNECTED */}
              <button
                className="start-btn"
                onClick={() => navigate("/aptitude")}
              >
                Start Round 1 →
              </button>

            </div>


            {/* ================= ROUND 2 ================= */}

            <div className="round-card round-two">

              <div className="round-number">
                02
              </div>

              <span className="round-status">
                TECHNICAL
              </span>

              <h3>Round 2</h3>

              <h4>Technical Interview</h4>

              <p>
                Answer technical questions based on
                programming, DSA and your domain.
              </p>

              <div className="round-info">
                <span>📝 2 Problems</span>
                <span>⏱️ 15–60 Mins</span>
              </div>

              {latestDSAAttempt && (
                <div className="latest-attempt-box dsa-attempt-box">
                  <div className="attempt-badge-header">
                    <span className="attempt-tag blue">DSA Progress</span>
                    <span className="attempt-date">
                      {new Date(latestDSAAttempt.completedAt).toDateString() === new Date().toDateString()
                        ? "Completed Today"
                        : new Date(latestDSAAttempt.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="attempt-metrics">
                    <div>
                      <strong>Difficulty:</strong>{" "}
                      <span className="diff-pill blue">
                        {latestDSAAttempt.difficulty ? latestDSAAttempt.difficulty.toUpperCase() : "EASY"}
                      </span>
                    </div>
                    <div>
                      <strong>Score:</strong> {latestDSAAttempt.score} / 60
                    </div>
                    <div>
                      <strong>Percentage:</strong>{" "}
                      <span className="perc-pill blue">
                        {latestDSAAttempt.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate("/dsa")}
              >
                Start Round 2 →
              </button>

            </div>


            {/* ================= ROUND 3 ================= */}

            <div className="round-card round-three">

              <div className="round-number">
                03
              </div>

              <span className="round-status">
                HR
              </span>

              <h3>Round 3</h3>

              <h4>HR Interview</h4>

              <p>
                Practice behavioral, situational and
                communication-based questions.
              </p>

              <div className="round-info">
                <span>📝 10 Questions</span>
                <span>⏱️ 15 Minutes</span>
              </div>

              <button
                onClick={() => alert("Round 3 (HR Interview) is coming soon!")}
              >
                Start Round 3 →
              </button>

            </div>

          </div>

        </section>


        {/* BOTTOM SECTION */}

        <section className="bottom-section">


          {/* SKILL DEVELOPMENT */}

          <div className="skill-card">

            <div className="section-title">

              <div>

                <h2>Skill Development</h2>

                <p>
                  Improve the skills that matter most.
                </p>

              </div>

              <span>📚</span>

            </div>


            <div className="skill">

              <div className="skill-name">
                <span>Python</span>
                <b>90%</b>
              </div>

              <div className="progress">
                <div className="progress-fill python"></div>
              </div>

            </div>


            <div className="skill">

              <div className="skill-name">
                <span>SQL</span>
                <b>80%</b>
              </div>

              <div className="progress">
                <div className="progress-fill sql"></div>
              </div>

            </div>


            <div className="skill">

              <div className="skill-name">
                <span>DSA</span>
                <b>60%</b>
              </div>

              <div className="progress">
                <div className="progress-fill dsa"></div>
              </div>

            </div>


            <div className="skill">

              <div className="skill-name">
                <span>Communication</span>
                <b>55%</b>
              </div>

              <div className="progress">
                <div className="progress-fill communication"></div>
              </div>

            </div>


            <button className="view-button">
              View Full Report →
            </button>

          </div>


          {/* OVERALL PROGRESS */}

          <div className="progress-card">

            <h2>Overall Progress</h2>

            <div className="circle-progress">

              <div className="circle-inner">

                <strong>75%</strong>

                <span>
                  Completed
                </span>

              </div>

            </div>

            <p>
              Great progress! Keep practicing 🚀
            </p>

          </div>


          {/* QUICK ACTIONS */}

          <div className="quick-card">

            <h2>Quick Actions</h2>

            <div className="quick-actions">

              <button>
                🎯
                <span>Mock Interview</span>
              </button>


              {/* CONNECTED TO APTITUDE */}
              <button
                onClick={() => navigate("/aptitude")}
              >
                📖
                <span>Practice Questions</span>
              </button>


              <button>
                💡
                <span>Skill Development</span>
              </button>


              <button>
                📊
                <span>View Reports</span>
              </button>

            </div>

          </div>

        </section>


        {/* FOOTER */}

        <footer>

          <strong>PrepGo</strong>

          <span>
            Where Practice Meets Opportunity
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Home;
