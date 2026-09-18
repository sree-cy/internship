
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* ================= HEADER ================= */}

      <header className="landing-header">

        <div className="landing-logo">
          <img
            src="/prepgo-logo.png"
            alt="PrepGo Logo"
          />
        </div>

        <button
          className="header-login-button"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

      </header>


      {/* ================= HERO SECTION ================= */}

      <main className="landing-main">

        <section className="landing-hero">

          {/* LOGO ABOVE TITLE */}

          <div className="landing-hero-logo">
            <img
              src="/prepgo-logo.png"
              alt="PrepGo"
            />
          </div>


          {/* SMALL LABEL */}

          <div className="landing-label">
            AI-POWERED INTERVIEW PREPARATION
          </div>


          {/* TITLE */}

          <h1 className="landing-title">
            Prepare Smarter.
            <br />
            <span>Interview Better.</span>
          </h1>


          {/* DESCRIPTION */}

          <p className="landing-description">
            AI-powered platform to ace your interviews
            <br />
            with confidence and clarity.
          </p>


          {/* MOTTO */}

          <p className="landing-motto">
            Where Practice Meets Opportunity
          </p>


          {/* BUTTONS */}
       <div className="landing-buttons">

         <button
               className="landing-login-button"
                onClick={() => navigate("/login")}
                >
            Login
        </button>

      </div>
          
        </section>


        {/* ================= FEATURES ================= */}

        <section className="landing-features">

          <div className="landing-feature-card">

            <div className="feature-icon">
              🤖
            </div>

            <div>
              <h3>
                AI Mock Interviews
              </h3>

              <p>
                Practice realistic interviews
                with AI-powered simulations.
              </p>
            </div>

          </div>


          <div className="landing-feature-card">

            <div className="feature-icon">
              ✦
            </div>

            <div>
              <h3>
                Smart Feedback
              </h3>

              <p>
                Get useful feedback and improve
                your interview performance.
              </p>
            </div>

          </div>


          <div className="landing-feature-card">

            <div className="feature-icon">
              📊
            </div>

            <div>
              <h3>
                Track Progress
              </h3>

              <p>
                Monitor your preparation and
                improve your skills.
              </p>
            </div>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="landing-footer">

        <span>
          © 2026 PrepGo
        </span>

        <span>
          Where Practice Meets Opportunity
        </span>

      </footer>

    </div>
  );
}

export default Landing;
