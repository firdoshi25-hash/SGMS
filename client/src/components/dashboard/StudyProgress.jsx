function StudyProgress() {
  return (
    <div className="study-progress">

      <div className="progress-header">
        <h2>Study Progress</h2>
        <span>This Week</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill"></div>
      </div>

      <div className="progress-info">
        <span>17 hours studied</span>
        <span>72%</span>
      </div>

    </div>
  );
}

export default StudyProgress;