import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Student() {
  const { user } = useAuth();
  return (
    <section className="account-page">
      <div className="page-heading"><div><h1>Student overview</h1><p>Your SGMS account and learning workspace.</p></div></div>
      <div className="student-overview">
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
        <span className="status-label">{user?.role || "student"}</span>
      </div>
      <div className="dashboard-shortcuts">
        <Link to="/profile">Edit profile</Link>
        <Link to="/attendance">Attendance records</Link>
        <Link to="/reports">Progress reports</Link>
      </div>
    </section>
  );
}

export default Student;