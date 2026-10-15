import { useState } from "react";
import "../../styles/StudySessionForm.css";

function StudySessionForm({ onClose, onAddSession }) {

  const [session, setSession] = useState({
    subject: "",
    topic: "",
    duration: "",
    progress: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSession((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!session.subject || !session.topic || !session.duration) {
      alert("Please fill all required fields.");
      return;
    }

    onAddSession({
      ...session,
      progress: Number(session.progress),
      status: "Pending",
    });
  };

  return (
    <div className="session-form-overlay">

      <div className="session-form">

        <div className="session-form-header">
          <div>
            <h2>Add Study Session</h2>
            <p>Create a new study session.</p>
          </div>

          <button
            type="button"
            className="session-close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <label>Subject</label>

          <input
            type="text"
            name="subject"
            placeholder="e.g. React"
            value={session.subject}
            onChange={handleChange}
          />

          <label>Topic</label>

          <input
            type="text"
            name="topic"
            placeholder="e.g. React Hooks"
            value={session.topic}
            onChange={handleChange}
          />

          <label>Duration</label>

          <input
            type="text"
            name="duration"
            placeholder="e.g. 45 minutes"
            value={session.duration}
            onChange={handleChange}
          />

          <label>Progress (%)</label>

          <input
            type="number"
            name="progress"
            min="0"
            max="100"
            value={session.progress}
            onChange={handleChange}
          />

          <div className="session-form-actions">

            <button
              type="button"
              className="session-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="session-save-btn"
            >
              Add Session
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default StudySessionForm;