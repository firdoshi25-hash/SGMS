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

  return (
    <div className="dashboard-content">
      <WelcomeCard name={user?.name} />
      {error && <div className="state-message error" role="alert">{error}</div>}
      {loading && <div className="state-message">Loading your dashboard...</div>}
      <div className="stats">
        <StatsCard title="Attendance" value={`${stats?.attendanceRate ?? 0}%`} />
        <StatsCard title="Goals completed" value={`${stats?.completedGoals ?? 0} / ${stats?.totalGoals ?? 0}`} />
        <StatsCard title="Study time" value={formatStudyTime(stats?.studyMinutes)} />
        <StatsCard title="Active projects" value={String(stats?.activeProjects ?? 0)} />
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