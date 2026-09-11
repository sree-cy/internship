import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {

  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <nav className="landing-navbar">

        <div className="prepgo-logo">
          <div className="prepgo-logo-box">
            PG
          </div>

          <span>PrepGo</span>
        </div>

        <button
          className="login-icon-button"
          onClick={() => navigate("/login")}
          title="Login"
        >
          👤
        </button>

      </nav>


      {/* HERO SECTION */}
      <main className="landing-hero">

        <div className="hero-content">

          <div className="welcome-badge">
            ✨ Welcome to PrepGo
          </div>

          <h1>
            Where Practice
            <br />
            <span>Meets Opportunity.</span>
          </h1>

          <p>
            Prepare for your interviews, improve your skills,
            build confidence and take the next step towards
            your dream career.
          </p>


          <div className="landing-buttons">

            <button
              className="start-learning-button"
              onClick={() => navigate("/home")}
            >
              Start Learning
              <span>→</span>
            </button>


            <button
              className="landing-login-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

          </div>


          <div className="landing-features">

            <div>
              <span>🎯</span>
              <p>Practice</p>
            </div>

            <div>
              <span>🤖</span>
              <p>AI Feedback</p>
            </div>

            <div>
              <span>📈</span>
              <p>Improve</p>
            </div>

            <div>
              <span>🚀</span>
              <p>Grow</p>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE CARD */}

        <div className="landing-visual">

          <div className="floating-card card-one">
            <span>🎯</span>
            <div>
              <strong>Practice</strong>
              <small>Improve your skills</small>
            </div>
          </div>


          <div className="main-visual-card">

            <div className="visual-logo">
              PG
            </div>

            <h2>PrepGo</h2>

            <p>
              Your journey to interview success
              starts here.
            </p>

            <div className="visual-progress">

              <div className="progress-text">
                <span>Interview Readiness</span>
                <b>75%</b>
              </div>

              <div className="progress-background">
                <div className="progress-fill"></div>
              </div>

            </div>

          </div>


          <div className="floating-card card-two">
            <span>🚀</span>
            <div>
              <strong>Opportunity</strong>
              <small>Build your future</small>
            </div>
          </div>

        </div>

      </main>


      {/* BOTTOM TEXT */}

      <div className="landing-bottom">

        <span>Practice</span>
        <b>→</b>
        <span>Improve</span>
        <b>→</b>
        <span>Grow</span>
        <b>→</b>
        <strong>Succeed</strong>

      </div>

    </div>
  );
}

export default Landing;
