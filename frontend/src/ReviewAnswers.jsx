import { useLocation, useNavigate } from "react-router-dom";
import "./ReviewAnswers.css";

function ReviewAnswers() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.questions) {
    return (
      <div className="review-page">
        <div className="review-card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <h2>No Review Answers Found</h2>
          <p style={{ color: "#64748b", margin: "12px 0 24px" }}>
            Please complete an aptitude test assessment to review detailed answers.
          </p>
          <button
            style={{
              padding: "10px 20px",
              background: "var(--primary-green, #16a34a)",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={() => navigate("/aptitude")}
          >
            Go to Aptitude Assessment
          </button>
        </div>
      </div>
    );
  }

  const { questions, answers = {} } = state;

  return (
    <div className="review-page">
      <h1>Review Answers</h1>

      {questions.map((q, index) => (
        <div key={index} className="review-card">
          <h3>
            Q{index + 1}. {q.question}
          </h3>

          {q.options.map((opt) => (
            <div
              key={opt}
              className={`review-option ${
                opt === q.answer
                  ? "correct"
                  : answers[index] === opt
                  ? "wrong"
                  : ""
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      ))}

      <button onClick={() => navigate("/home")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default ReviewAnswers;
