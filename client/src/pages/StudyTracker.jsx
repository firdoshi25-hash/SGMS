import { useEffect, useState } from "react";
import ResourceManager from "../components/common/ResourceManager";
import StudyTimer from "../components/study/StudyTimer";
import "../styles/StudyTracker.css";
import { api } from "../services/api";

const sessionFields = [
  { name: "subject", label: "Subject", required: true, maxLength: 100 },
  { name: "topic", label: "Topic", required: true, maxLength: 160 },
  { name: "durationMinutes", label: "Duration (minutes)", type: "number", min: 1, max: 1440, required: true },
  { name: "progress", label: "Progress (%)", type: "number", min: 0, max: 100, defaultValue: 0 },
  { name: "status", label: "Status", type: "status", defaultValue: "pending", options: [
    { value: "pending", label: "Pending" }, { value: "completed", label: "Completed" },
  ] },
  { name: "studiedAt", label: "Study date", type: "date" },
];

function StudyTracker() {
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState("");
  const [timerNotice, setTimerNotice] = useState("");

  async function refreshSummary() {
    try {
      const response = await api.get("/dashboard");
      setSummary(response.stats);
      setSummaryError("");
    } catch (requestError) {
      setSummaryError(requestError.message);
    }
  }

  useEffect(() => { refreshSummary(); }, []);

  async function recordFocusSession(durationMinutes) {
    setTimerNotice("");
    try {
      await api.post("/study-sessions", {
        subject: "Focus session",
        topic: "Pomodoro focus session",
        durationMinutes,
        progress: 100,
        status: "completed",
      });
      setTimerNotice("Focus session saved to your study history.");
      await refreshSummary();
    } catch (requestError) {
      setTimerNotice(requestError.message);
    }
  }

  return (
    <div className="study-tracker-page">
      <div className="study-tracker-header">
        <div>
          <span className="study-label">STUDY CENTER</span>
          <h1>Study Tracker</h1>
          <p>Plan your study sessions, track progress, and stay consistent.</p>
        </div>
        <div className="study-date">Session history</div>
      </div>
      <div className="study-top-grid">
        <StudyTimer onComplete={recordFocusSession} />
        <section className="study-summary">
          <h2>Your study summary</h2>
          {summaryError && <div className="state-message error" role="alert">{summaryError}</div>}
          <div className="summary-item"><span>Study sessions</span><strong>{summary?.totalSessions ?? "--"}</strong></div>
          <div className="summary-item"><span>Total study time</span><strong>{summary ? `${Math.floor(summary.studyMinutes / 60)}h ${summary.studyMinutes % 60}m` : "--"}</strong></div>
          <div className="summary-item"><span>Goals completed</span><strong>{summary ? `${summary.completedGoals} / ${summary.totalGoals}` : "--"}</strong></div>
          <div className="summary-item"><span>Active projects</span><strong>{summary?.activeProjects ?? "--"}</strong></div>
          {timerNotice && <p className={timerNotice.includes("saved") ? "success-copy" : "error-copy"} role="status">{timerNotice}</p>}
        </section>
      </div>
      <ResourceManager
        title="Study sessions"
        description="Add, update, or remove a study record. Completed timer sessions are saved here too."
        endpoint="study-sessions"
        fields={sessionFields}
        onChange={refreshSummary}
      />
    </div>
  );
}

export default StudyTracker;