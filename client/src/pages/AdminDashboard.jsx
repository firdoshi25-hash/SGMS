import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";

function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") return undefined;
    let active = true;
    setLoading(true);
    Promise.all([api.get("/admin/users"), api.get("/admin/leave")])
      .then(([userResponse, leaveResponse]) => {
        if (!active) return;
        setUsers(userResponse.users);
        setLeaveRequests(leaveResponse.items);
      })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user?.role]);

  async function reviewRequest(item, status) {
    setError("");
    try {
      const response = await api.patch(`/admin/leave/${item._id}`, { status });
      setLeaveRequests((previous) => previous.map((record) => record._id === item._id ? response.item : record));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (user?.role !== "admin") {
    return <div className="state-message error" role="alert">Admin access is required for this page.</div>;
  }

  return (
    <section className="admin-page">
      <div className="page-heading"><div><h1>Administration</h1><p>Student accounts and leave requests.</p></div></div>
      {error && <div className="state-message error" role="alert">{error}</div>}
      {loading && <div className="state-message">Loading administration data...</div>}
      <section className="dashboard-panel admin-section">
        <h2>Accounts ({users.length})</h2>
        {!loading && users.length === 0 && <p className="muted-copy">No accounts found.</p>}
        {users.map((record) => <article className="resource-item" key={record._id}><div><h3>{record.name}</h3><p>{record.email}</p></div><span className="status-label">{record.role}</span></article>)}
      </section>
      <section className="dashboard-panel admin-section">
        <h2>Leave requests</h2>
        {!loading && leaveRequests.length === 0 && <p className="muted-copy">No leave requests.</p>}
        {leaveRequests.map((item) => <article className="resource-item" key={item._id}>
          <div><h3>{item.owner?.name || "Student"}</h3><p>{item.reason}</p><small>{new Date(item.startDate).toLocaleDateString()} – {new Date(item.endDate).toLocaleDateString()} · {item.owner?.email}</small></div>
          <div className="resource-actions"><span className={`status-label ${item.status}`}>{item.status}</span>{item.status === "pending" && <><button className="primary-button" type="button" onClick={() => reviewRequest(item, "approved")}>Approve</button><button className="danger-button" type="button" onClick={() => reviewRequest(item, "rejected")}>Reject</button></>}</div>
        </article>)}
      </section>
    </section>
  );
}

export default AdminDashboard;