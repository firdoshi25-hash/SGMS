import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const pageTitles = {
  "/dashboard": "Dashboard", "/attendance": "Attendance", "/goals": "Goals",
  "/notes": "Notes", "/projects": "Projects", "/study-tracker": "Study Tracker",
  "/leave": "Leave requests", "/reports": "Reports", "/notifications": "Notifications", "/tasks": "Tasks", "/profile": "Profile",
  "/student": "Student", "/settings": "Settings", "/admin": "Administration",
};

function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <header className="top-navbar">
      <button className="menu-toggle" type="button" aria-label="Open navigation" onClick={onMenuClick}>☰</button>
      <h1>{pageTitles[pathname] || "Student Growth"}</h1>
      <div className="topbar-account">
        <span>{user?.name}</span>
        <button type="button" className="text-button" onClick={() => logout().catch(() => {})}>Sign out</button>
    </div>
    </header>
  );
}

export default Navbar;