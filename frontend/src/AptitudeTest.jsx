import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AptitudeTest.css";

function AptitudeTest() {
  const { level = "easy" } = useParams();
  const navigate = useNavigate();

  const timerMinutes = {
    easy: 15,
    medium: 20,
    hard: 25,
  };

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    (timerMinutes[level.toLowerCase()] || 15) * 60
  );

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const questionsRef = useRef(questions);
  questionsRef.current = questions;

  // =========================================================================
  // FETCH DYNAMIC QUESTIONS FROM BACKEND
  // =========================================================================
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/aptitude/${level.toLowerCase()}`
        );
        if (res.data && res.data.questions && res.data.questions.length > 0) {
          setQuestions(res.data.questions);
        }
      } catch (err) {
        console.error("Error fetching aptitude questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [level]);

  // =========================================================================
  // SUBMIT HANDLER VIA AXIOS
  // =========================================================================
  const handleFinalSubmit = async (currentAnswers = answersRef.current) => {
    try {
      setSubmitting(true);

      const storedUser = localStorage.getItem("prepgoUser");
      let userId = null;
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          userId = parsed.id || parsed._id || null;
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

      const res = await axios.post("http://localhost:5000/api/aptitude/submit", {
        difficulty: level.toLowerCase(),
        answers: currentAnswers,
        userId,
      });

      const data = res.data;

      navigate("/aptitude/result", {
        state: {
          level,
          score: data.score,
          correct: data.correct,
          wrong: data.wrong,
          percentage: data.percentage,
          questions: data.questions,
          answers: data.answers,
        },
      });
    } catch (err) {
      console.error("Test submission failed:", err);
      alert("Failed to submit test. Please make sure the backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================================
  // COUNTDOWN TIMER
  // =========================================================================
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Time is over! Submitting your test.");
          handleFinalSubmit(answersRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level]);

  if (loading) {
    return (
      <div className="test-page">
        <div className="question-card" style={{ textAlign: "center", maxWidth: "500px", margin: "100px auto" }}>
          <h2>Loading {level.toUpperCase()} questions...</h2>
          <p style={{ color: "#64748b", marginTop: "10px" }}>Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="test-page">
        <div className="question-card" style={{ textAlign: "center", maxWidth: "500px", margin: "100px auto" }}>
          <h2>No Questions Found</h2>
          <p style={{ color: "#64748b", margin: "10px 0 20px" }}>
            Unable to load questions for this difficulty level. Please ensure the backend is seeded.
          </p>
          <button className="start-btn" onClick={() => navigate("/aptitude")}>
            Back to Levels
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current] || questions[0];
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="test-page">
      <div className="exam-layout">
        {/* LEFT SIDE */}
        <div>
          <div className="test-header">
            <div>
              <h2>{level.toUpperCase()} Aptitude Test</h2>
              <p>
                Question {current + 1} of {questions.length}
              </p>
            </div>

            <div className={`timer ${timeLeft <= 120 ? "warning" : ""}`}>
              ⏱ {minutes}:{seconds}
            </div>
          </div>

          <div className="progress-box">
            Answered {Object.keys(answers).length} / {questions.length}
          </div>

          <div className="question-card">
            <h3>{q.question}</h3>

            <div className="options">
              {q.options.map((opt) => (
                <label key={opt} className="option">
                  <input
                    type="radio"
                    name={`q-${current}`}
                    value={opt}
                    checked={answers[current] === opt}
                    onChange={() =>
                      setAnswers({
                        ...answers,
                        [current]: opt,
                      })
                    }
                  />
                  {opt}
                </label>
              ))}
            </div>

            <div className="btns">
              <button
                disabled={current === 0}
                onClick={() => setCurrent(current - 1)}
              >
                Previous
              </button>

              {current === questions.length - 1 ? (
                <button onClick={() => setShowModal(true)}>
                  Submit
                </button>
              ) : (
                <button onClick={() => setCurrent(current + 1)}>
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE PALETTE */}
        <div className="palette">
          <h3>Questions</h3>

          <div className="palette-grid">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`palette-btn ${
                  current === index
                    ? "current"
                    : answers[index]
                    ? "answered"
                    : ""
                }`}
                onClick={() => setCurrent(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* SUBMIT CONFIRMATION MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="submit-modal">
              <h2>Submit Test?</h2>

              <div className="summary">
                <p>Answered: {Object.keys(answers).length}</p>
                <p>
                  Unanswered: {questions.length - Object.keys(answers).length}
                </p>
              </div>

              <div className="modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Continue Test
                </button>

                <button
                  className="submit-btn"
                  onClick={() => handleFinalSubmit()}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Final Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AptitudeTest;
