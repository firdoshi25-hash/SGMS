function Notifications() {
  return (
    <div className="notifications-card">

      <div className="notifications-header">
        <h2>Notifications</h2>
        <span>3 New</span>
      </div>

      <div className="notification-item">
        <span>📚</span>
        <div>
          <h4>New Study Task</h4>
          <p>React practice has been added.</p>
        </div>
      </div>

      <div className="notification-item">
        <span>🎯</span>
        <div>
          <h4>Goal Reminder</h4>
          <p>Complete your daily goal today.</p>
        </div>
      </div>

      <div className="notification-item">
        <span>📅</span>
        <div>
          <h4>Attendance Reminder</h4>
          <p>Don't forget to mark today's attendance.</p>
        </div>
      </div>

    </div>
  );
}

export default Notifications;