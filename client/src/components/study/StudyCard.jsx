import "../../styles/StudyCard.css";

function StudyCard({
  subject,
  topic,
  duration,
  progress,
  status,
}) {
  return (
    <div className="study-card">

      <div className="study-card-top">

        <div>
          <span className="study-subject">
            {subject}
          </span>

          <h3>{topic}</h3>
        </div>

        <span
          className={`study-status ${status?.toLowerCase()}`}
        >
          {status}
        </span>

      </div>

      <div className="study-duration">
        ⏱️ {duration}
      </div>

      <div className="study-progress">

        <div className="study-progress-header">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="study-progress-bar">

          <div
            className="study-progress-fill"
            style={{ width: `${progress}%` }}
          />

        </div>

      </div>

    </div>
  );
}

export default StudyCard;