import { useLocation, useNavigate } from "react-router-dom";
import "./AptitudeResult.css";

function AptitudeResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="result-page">
        <h2>No Result Found</h2>
        <div className="result-buttons">
  <button
    onClick={() =>
      navigate("/aptitude/review", {
        state,
      })
    }
  >
    Review Answers
  </button>

  <button
    onClick={() => navigate("/home")}
  >
    Dashboard
  </button>
</div>
      </div>
    );
  }

  const { level, score, correct, wrong, percentage } = state;

  let badge = "Needs Improvement";

  if (percentage >= 90) badge = "Excellent";
  else if (percentage >= 75) badge = "Good";
  else if (percentage >= 50) badge = "Average";

  return (
    <div className="result-page">
      <div className="result-card">
        <h1>Round 1 Result</h1>
        <p className="level">{level.toUpperCase()} Level</p>

        <div className="percentage-circle">
          <span>{percentage}%</span>
        </div>

        <div className="result-grid">
          <div className="result-box">
            <h3>Score</h3>
            <p>{score} / 60</p>
          </div>

          <div className="result-box">
            <h3>Correct</h3>
            <p>{correct}</p>
          </div>

          <div className="result-box">
            <h3>Wrong</h3>
            <p>{wrong}</p>
          </div>
        </div>

        <div className="badge">{badge}</div>

        <div className="result-actions-column" style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
          <button
            type="button"
            className="dashboard-btn"
            onClick={() => navigate("/dsa")}
            style={{ fontWeight: "700" }}
          >
            Proceed to Round 2 (Technical DSA) →
          </button>

          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: "1.5px solid var(--primary-green-border, #bbf7d0)",
                background: "var(--primary-green-subtle, #f0fdf4)",
                color: "var(--primary-green-dark, #15803d)",
                fontWeight: "600",
                fontSize: "13.5px",
                cursor: "pointer",
              }}
              onClick={() =>
                navigate("/aptitude/review", {
                  state: {
                    questions: state.questions || [],
                    answers: state.answers || {},
                  },
                })
              }
            >
              📖 Review Answers
            </button>

            <button
              type="button"
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: "1.5px solid var(--border, #e2e8f0)",
                background: "#ffffff",
                color: "var(--text-primary, #0f172a)",
                fontWeight: "600",
                fontSize: "13.5px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/progress")}
            >
              📊 View Progress
            </button>
          </div>

          <button
            type="button"
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: "12px",
              border: "1px solid var(--border, #e2e8f0)",
              background: "transparent",
              color: "var(--text-secondary, #64748b)",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/home")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default AptitudeResult;
