import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatsCard from "../components/dashboard/StatsCard";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import "../styles/dashboard.css";

function formatStudyTime(minutes = 0) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}

function completionPercent(completed = 0, total = 0) {
  return total ? Math.min(100, Math.round((completed / total) * 100)) : 0;
}

function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([api.get("/dashboard"), api.get("/tasks")])
      .then(([summary, taskResponse]) => {
        if (!active) return;
        setDashboard(summary);
        setTasks(taskResponse.items.slice(0, 5));
      })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const stats = dashboard?.stats;
  const taskProgress = completionPercent(stats?.completedTasks, stats?.totalTasks);
  const goalProgress = completionPercent(stats?.completedGoals, stats?.totalGoals);
  const studyProgress = Math.min(100, Math.round(((stats?.studyMinutes || 0) / 600) * 100));
  const overallProgress = Math.round((taskProgress + goalProgress + studyProgress) / 3);

  return (
    <div className="dashboard-content">
      <WelcomeCard name={user?.name} />
      {error && <div className="state-message error" role="alert">{error}</div>}
      {loading && <div className="state-message">Loading your dashboard...</div>}
      <div className="stats stats-compact">
        <StatsCard title="Study time" value={formatStudyTime(stats?.studyMinutes || 0)} icon="🕒" />
        <StatsCard title="Goals completed" value={`${goalProgress}%`} icon="◎" emphasis />
      </div>
      <div className="dashboard-panels dashboard-panels-compact">
        <section className="dashboard-panel quick-panel">
          <div className="panel-heading"><h2>Quick access</h2><Link to="/dashboard">View all</Link></div>
          <div className="quick-grid">
            <Link to="/tasks" className="quick-card-item"><span className="quick-icon">✓</span><span>My Tasks</span></Link>
            <Link to="/attendance" className="quick-card-item"><span className="quick-icon">◫</span><span>Attendance</span></Link>
            <Link to="/study-tracker" className="quick-card-item"><span className="quick-icon">⏱</span><span>Study Tracker</span></Link>
            <Link to="/projects" className="quick-card-item"><span className="quick-icon">▣</span><span>Projects</span></Link>
          </div>
        </section>
        <section className="dashboard-panel progress-panel" aria-labelledby="student-progress-title">
          <div className="panel-heading">
            <h2 id="student-progress-title">Student progress</h2>
            <strong>{overallProgress}%</strong>
          </div>
          <div className="progress-track" role="progressbar" aria-label="Overall student progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={overallProgress}>
            <span style={{ width: `${overallProgress}%` }} />
          </div>
          <div className="progress-breakdown">
            <div><span>Tasks</span><strong>{taskProgress}%</strong><div className="progress-track small" role="progressbar" aria-label="Task completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={taskProgress}><span style={{ width: `${taskProgress}%` }} /></div></div>
            <div><span>Study target</span><strong>{studyProgress}%</strong><div className="progress-track small" role="progressbar" aria-label="Study target completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={studyProgress}><span style={{ width: `${studyProgress}%` }} /></div></div>
            <div><span>Goals</span><strong>{goalProgress}%</strong><div className="progress-track small" role="progressbar" aria-label="Goal completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={goalProgress}><span style={{ width: `${goalProgress}%` }} /></div></div>
          </div>
          <p className="progress-note">Study target: 10 hours total</p>
        </section>
      </div>
      <div className="dashboard-panels">
        <section className="dashboard-panel">
          <div className="panel-heading"><h2>Tasks</h2><Link to="/tasks">View all</Link></div>
          {tasks.length ? tasks.map((task) => <p className="dashboard-row" key={task._id}><span>{task.title}</span><span className={`status-label ${task.status}`}>{task.status}</span></p>) : <p className="muted-copy">No tasks yet. Add one to get started.</p>}
          <Link className="dashboard-action" to="/tasks">Create a task</Link>
        </section>
        <section className="dashboard-panel">
          <div className="panel-heading"><h2>Recent activity</h2><Link to="/reports">Reports</Link></div>
          {dashboard?.recent?.length ? dashboard.recent.map((item) => <p className="dashboard-row" key={`${item.kind}-${item._id}`}><span>{item.title || item.topic || item.subject}</span><small>{item.kind} · {new Date(item.createdAt).toLocaleDateString()}</small></p>) : <p className="muted-copy">Your saved activity will appear here.</p>}
        </section>
      </div>
      <div className="dashboard-shortcuts">
        <Link to="/goals">Goals</Link>
        <Link to="/study-tracker">Study tracker</Link>
        <Link to="/attendance">Mark attendance</Link>
        <Link to="/notes">Study notes</Link>
        <Link to="/notifications">Notifications ({dashboard?.notifications?.length ?? 0})</Link>
      </div>
    </div>
  );
}

export default Dashboard;