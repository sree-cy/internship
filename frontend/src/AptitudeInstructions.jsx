import { useParams, useNavigate } from "react-router-dom";
import "./AptitudeInstructions.css";

function AptitudeInstructions() {
  const { level } = useParams();
  const navigate = useNavigate();

  const time = {
    easy: 15,
    medium: 20,
    hard: 25,
  };

  return (
    <div className="instruction-page">
      <div className="instruction-card">
        <h1>{level.toUpperCase()} Aptitude Test</h1>
        <p>Read the instructions carefully before starting.</p>

        <div className="details">
          <div><strong>Level:</strong> {level}</div>
          <div><strong>Questions:</strong> 20</div>
          <div><strong>Time:</strong> {time[level]} Minutes</div>
          <div><strong>Total Marks:</strong> 60</div>
        </div>

        <h3>Instructions</h3>

        <ul>
          <li>Each question has only one correct answer.</li>
          <li>You cannot pause the timer once the test starts.</li>
          <li>Each correct answer carries 3 marks.</li>
          <li>There is no negative marking.</li>
          <li>Submit before the timer ends.</li>
        </ul>

        <button
          className="start-test-btn"
          onClick={() => navigate(`/aptitude/test/${level}`)}
        >
          Start Test
        </button>
      </div>
    </div>
  );
}

export default AptitudeInstructions;
