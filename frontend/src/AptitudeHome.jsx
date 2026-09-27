import "./AptitudeHome.css";
import { useNavigate } from "react-router-dom";

function AptitudeHome() {
  const navigate = useNavigate();

  const levels = [
    {
      name: "Easy",
      color: "easy",
      time: "15 Minutes",
      questions: 20,
      marks: 60,
    },
    {
      name: "Medium",
      color: "medium",
      time: "20 Minutes",
      questions: 20,
      marks: 60,
    },
    {
      name: "Hard",
      color: "hard",
      time: "25 Minutes",
      questions: 20,
      marks: 60,
    },
  ];

  return (
    <div className="aptitude-page">
      <div className="aptitude-header">
        <h1>Round 1 — Aptitude Assessment</h1>
        <p>
          Choose your preparation level and complete the aptitude screening test.
        </p>
      </div>

      <div className="level-grid">
        {levels.map((level) => (
          <div className={`level-card ${level.color}`} key={level.name}>
            <h2>{level.name}</h2>

            <div className="info">
              <p>📝 {level.questions} Questions</p>
              <p>⏱ {level.time}</p>
              <p>🏆 {level.marks} Marks</p>
            </div>

            <button
              onClick={() =>
                navigate(
                  `/aptitude/instructions/${level.name.toLowerCase()}`
                )
              }
            >
              Start {level.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AptitudeHome;
