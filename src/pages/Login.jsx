import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Message from "../components/Message.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/internships" replace />;

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setError("");

    // Quick checks for a friendly experience (the server checks again)
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password); // calls POST /api/auth/login
      navigate(location.state?.from || "/internships", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page narrow">
      <h1>Login</h1>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <Message type="error">{error}</Message>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>New student? <Link to="/register">Create an account</Link></p>
    </main>
  );
}
