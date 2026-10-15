function TodaySchedule() {
  return (
    <div className="schedule-card">

      <div className="schedule-header">
        <h2>Today's Schedule</h2>
        <span>Today</span>
      </div>

      <div className="schedule-item">
        <div>
          <h3>1st Half</h3>
          <p>React Practice</p>
        </div>

        <span className="study">Study</span>
      </div>

      <div className="schedule-item">
        <div>
          <h3>2nd Half</h3>
          <p>JavaScript + DSA</p>
        </div>

        <span className="study">Study</span>
      </div>

      <div className="schedule-item">
        <div>
          <h3>3rd Half</h3>
          <p>Recreation Time</p>
        </div>

        <span className="recreation">Recreation</span>
      </div>

    </div>
  );
}

export default TodaySchedule;