import { useState } from "react";
import { Link } from "react-router-dom";
import Message from "../components/Message.jsx";
import { registerUser } from "../services/api.js";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [details, setDetails] = useState([]);
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setDetails([]);
    setSuccess("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in name, email and password.");
      return;
    }

    setSubmitting(true);
    try {
      // Note: we send NO role. The server always creates a "student".
      const data = await registerUser(name.trim(), email.trim(), password);
      setSuccess(data.message);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
      setDetails(err.details || []);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page narrow">
      <h1>Student Registration</h1>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <Message type="error" title={error || undefined}>
          {details.length > 0 && (
            <ul>
              {details.map((d) => <li key={d}>{d}</li>)}
            </ul>
          )}
        </Message>
        <Message type="success">
          {success && <>{success} <Link to="/login">Go to login</Link></>}
        </Message>

        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        <small className="muted">At least 8 characters, with a letter and a number.</small>

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </main>
  );
}
