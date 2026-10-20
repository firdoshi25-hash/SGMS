import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleSignOut() {
    await logout().catch(() => {});
    navigate("/login", { replace: true });
  }

  return (
    <header className="top-navbar dashboard-topbar">
      <div className="brand-block">
        <button className="menu-toggle" type="button" aria-label="Open navigation" onClick={onMenuClick}>☰</button>
        <div className="brand-badge" aria-hidden="true">🎓</div>
        <div className="brand-copy">
          <strong>SGMS</strong>
          <small>STUDENT GROWTH &amp; MANAGEMENT</small>
        </div>
      </div>
      <div className="topbar-actions">
        <Link to="/notifications" className="icon-btn" aria-label="Notifications" title="Notifications">🔔</Link>
        <button type="button" className="signout-button" onClick={handleSignOut} title={`Sign out${user?.name ? ` ${user.name}` : ""}`}>
          <span aria-hidden="true">↪</span><span>Sign out</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;