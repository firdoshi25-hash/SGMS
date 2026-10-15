import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link className="home-brand" to="/">SGMS <span>Student Growth</span></Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button className="home-signout" type="button" onClick={() => logout().catch(() => {})}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;