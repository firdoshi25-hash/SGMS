import { useEffect, useState } from "react";
import { api } from "../services/api";

function Reports() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get("/reports")
      .then((data) => { if (active) setReport(data); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const stats = report?.stats;
  return (
    <section className="reports-page">
      <div className="page-heading"><div><h1>Reports</h1><p>A summary of your saved progress.</p></div></div>
      {error && <div className="state-message error" role="alert">{error}</div>}
      {loading && <div className="state-message">Loading report...</div>}
      {stats && <div className="report-grid">
        <article><span>Attendance</span><strong>{stats.attendanceRate}%</strong><small>{stats.attendanceDays} recorded days</small></article>
        <article><span>Goals</span><strong>{stats.completedGoals} / {stats.totalGoals}</strong><small>completed</small></article>
        <article><span>Tasks</span><strong>{stats.completedTasks} / {stats.totalTasks}</strong><small>completed</small></article>
        <article><span>Study time</span><strong>{Math.floor(stats.studyMinutes / 60)}h {stats.studyMinutes % 60}m</strong><small>recorded total</small></article>
        <article><span>Active projects</span><strong>{stats.activeProjects}</strong><small>in progress or planned</small></article>
      </div>}
      <section className="dashboard-panel report-activity"><h2>Recent activity</h2>
        {report?.recent?.length ? report.recent.map((item) => <p className="dashboard-row" key={`${item.kind}-${item._id}`}><span>{item.title || item.topic || item.subject}</span><small>{item.kind} · {new Date(item.createdAt).toLocaleDateString()}</small></p>) : !loading && <p className="muted-copy">No saved activity to report yet.</p>}
      </section>
    </section>
  );
}

export default Reports;