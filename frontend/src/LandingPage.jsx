import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* ================= HEADER ================= */}
      <header className="landing-header">
        <div className="landing-brand" onClick={() => navigate("/login")}>
          <div className="landing-brand-logo">PG</div>
          <span className="landing-brand-name">PrepGo</span>
        </div>

        <button
          type="button"
          className="header-login-btn"
          onClick={() => navigate("/login")}
        >
          Login →
        </button>
      </header>

      {/* ================= HERO SECTION ================= */}
      <main className="landing-hero">
        <div className="landing-hero-content">
          {/* Small label */}
          <div className="landing-label">
            AI-POWERED INTERVIEW PREPARATION
          </div>

          {/* Main heading */}
          <h1 className="landing-title">
            Prepare Smarter.
            <br />
            <span>Interview Better.</span>
          </h1>

          {/* Short description */}
          <p className="landing-description">
            Practice smarter with AI-powered interview preparation.
            <br />
            Build confidence, improve your skills, and get interview ready.
          </p>

          {/* Action buttons */}
          <div className="landing-buttons">
            <button
              type="button"
              className="landing-btn-primary"
              onClick={() => navigate("/login")}
            >
              Get Started →
            </button>
            <button
              type="button"
              className="landing-btn-secondary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>

          {/* Small supporting text */}
          <p className="landing-supporting-text">
            Where Practice Meets Opportunity
          </p>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
