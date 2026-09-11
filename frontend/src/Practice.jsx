import React, { useEffect, useState } from "react";
import "./Practice.css";

function Practice() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stores selected option for each question
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Stores result returned by backend
  const [results, setResults] = useState({});

  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/questions"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch questions"
          );
        }

        setQuestions(data.questions || []);
      } catch (err) {
        console.error("Question fetch error:", err);
        setError("Unable to load questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle MCQ selection
  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((previous) => ({
      ...previous,
      [questionId]: optionIndex,
    }));

    // Remove old result if user changes answer
    setResults((previous) => {
      const updated = { ...previous };
      delete updated[questionId];
      return updated;
    });
  };

  // Submit MCQ answer
  const submitMCQ = async (questionId) => {
    const selectedAnswer = selectedAnswers[questionId];

    if (selectedAnswer === undefined) {
      alert("Please select an answer first.");
      return;
    }

    setSubmitting((previous) => ({
      ...previous,
      [questionId]: true,
    }));

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/answers/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId,
            selectedAnswer,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to check answer"
        );
      }

      setResults((previous) => ({
        ...previous,
        [questionId]: data,
      }));

    } catch (err) {
      console.error("Answer submission error:", err);
      alert(err.message || "Failed to submit answer");
    } finally {
      setSubmitting((previous) => ({
        ...previous,
        [questionId]: false,
      }));
    }
  };

  if (loading) {
    return (
      <div className="practice-page">
        <h2>Loading questions...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="practice-page">
        <h2>{error}</h2>
        <p>
          Make sure your PrepGo backend is running on
          port 5000.
        </p>
      </div>
    );
  }

  return (
    <div className="practice-page">

      <div className="practice-header">
        <div>
          <h1>Practice</h1>
          <p>
            Improve your skills with PrepGo questions.
          </p>
        </div>

        <div className="question-count">
          {questions.length} Questions
        </div>
      </div>

      <div className="question-list">

        {questions.map((question, index) => {
          const result = results[question._id];
          const selectedAnswer =
            selectedAnswers[question._id];

          return (
            <div
              className="question-card"
              key={question._id}
            >

              <div className="question-top">

                <span className="question-number">
                  Question {index + 1}
                </span>

                <span className="question-type">
                  {question.type}
                </span>

                <span className="difficulty">
                  {question.difficulty}
                </span>

              </div>

              <h2>{question.title}</h2>

              <p className="question-description">
                {question.description}
              </p>

              {/* MCQ */}

              {question.type === "MCQ" && (
                <div className="mcq-section">

                  <div className="options">

                    {question.options?.map(
                      (option, optionIndex) => (
                        <label
                          className="option"
                          key={optionIndex}
                        >

                          <input
                            type="radio"
                            name={`question-${question._id}`}
                            value={optionIndex}
                            checked={
                              selectedAnswer ===
                              optionIndex
                            }
                            onChange={() =>
                              handleOptionChange(
                                question._id,
                                optionIndex
                              )
                            }
                            disabled={
                              submitting[question._id]
                            }
                          />

                          <span>
                            {option}
                          </span>

                        </label>
                      )
                    )}

                  </div>

                  <button
                    className="submit-answer-button"
                    onClick={() =>
                      submitMCQ(question._id)
                    }
                    disabled={
                      submitting[question._id]
                    }
                  >
                    {submitting[question._id]
                      ? "Checking..."
                      : "Submit Answer"}
                  </button>

                  {/* Result */}

                  {result && (
                    <div
                      className={
                        result.isCorrect
                          ? "answer-result correct"
                          : "answer-result wrong"
                      }
                    >

                      <h3>
                        {result.isCorrect
                          ? "✅ Correct!"
                          : "❌ Wrong Answer"}
                      </h3>

                      {!result.isCorrect && (
                        <p>
                          Correct option:{" "}
                          {question.options?.[
                            result.correctAnswer
                          ]}
                        </p>
                      )}

                      {result.explanation && (
                        <p>
                          <strong>
                            Explanation:
                          </strong>{" "}
                          {result.explanation}
                        </p>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* Coding */}

              {question.type === "Coding" && (
                <div className="coding-preview">

                  <div>
                    <strong>Topic:</strong>{" "}
                    {question.topic}
                  </div>

                  <div>
                    <strong>Languages:</strong>{" "}
                    {question.allowedLanguages?.join(
                      ", "
                    )}
                  </div>

                  <button className="solve-button">
                    Solve Problem →
                  </button>

                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Practice;
