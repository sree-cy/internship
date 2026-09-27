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

        <button
          className="dashboard-btn"
          onClick={() => navigate("/home")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AptitudeResult;
