import { useLocation, useNavigate } from "react-router-dom";
import "./ReviewAnswers.css";

function ReviewAnswers() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { questions, answers } = state;

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
