import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">Secure Internship Tracker</Link>
      <nav>
        {user ? (
          <>
            <Link to="/internships">Internships</Link>
            {user.role === "student" && <Link to="/student">My Dashboard</Link>}
            {user.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
            <span className={"role-badge role-" + user.role}>{user.name} ({user.role})</span>
            <button className="btn btn-light" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
