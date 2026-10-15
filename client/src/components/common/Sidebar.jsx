import { NavLink } from "react-router-dom";

const links = [
  ["/dashboard", "Dashboard"],
  ["/attendance", "Attendance"],
  ["/tasks", "Tasks"],
  ["/goals", "Goals"],
  ["/notes", "Notes"],
  ["/projects", "Projects"],
  ["/study-tracker", "Study Tracker"],
  ["/leave", "Leave requests"],
  ["/reports", "Reports"],
  ["/notifications", "Notifications"],
  ["/profile", "Profile"],
  ["/student", "Student overview"],
  ["/settings", "Settings"],
];

function Sidebar({ isOpen = false, onNavigate = () => {} }) {
  return (
    <aside className={`sidebar${isOpen ? " is-open" : ""}`}>
      <NavLink className="sidebar-brand" to="/dashboard" onClick={onNavigate}>SGMS <span>STUDENT GROWTH</span></NavLink>
      <nav aria-label="Main navigation">
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => isActive ? "is-active" : ""}>
            {label}
          </NavLink>
        ))}
      </nav>
      <NavLink className="sidebar-admin" to="/admin" onClick={onNavigate}>Administration</NavLink>
    </aside>
  );
}

export default Sidebar;