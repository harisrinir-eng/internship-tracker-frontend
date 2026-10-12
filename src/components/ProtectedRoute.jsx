import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wrap a page with <ProtectedRoute> to require login.
// Add roles={["admin"]} to also require a role. (The server still re-checks everything.)
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="center-text">Checking your login...</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/access-denied" replace />;

  return children;
}
