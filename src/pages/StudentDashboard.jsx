import { useState } from "react";
import { Link } from "react-router-dom";
import Message from "../components/Message.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getAllUsers, getUserById } from "../services/api.js";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [result, setResult] = useState(null); // { type, text }

  // Demo button 1: a student calling their OWN record - allowed (200)
  async function tryOwnRecord() {
    try {
      const data = await getUserById(user.id);
      setResult({ type: "success", text: `200 OK - the server returned your own record (${data.user.email}).` });
    } catch (err) {
      setResult({ type: "error", text: `${err.status}: ${err.message}` });
    }
  }

  // Demo button 2: a student calling an ADMIN-ONLY API - blocked (403)
  async function tryAdminApi() {
    try {
      await getAllUsers();
      setResult({ type: "success", text: "200 OK - (this should NOT happen for a student!)" });
    } catch (err) {
      setResult({ type: "error", text: `${err.status} - ${err.message}` });
    }
  }

  return (
    <main className="page">
      <h1>Student Dashboard</h1>

      <section className="panel">
        <h2>My profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> <span className={"role-badge role-" + user.role}>{user.role}</span></p>
        <p><Link to="/internships">Browse internships →</Link></p>
      </section>

      <section className="panel">
        <h2>Permission demo</h2>
        <p className="muted">Click the buttons to see what the SERVER allows and blocks.</p>
        <div className="row">
          <button className="btn" onClick={tryOwnRecord}>Read my own record</button>
          <button className="btn btn-danger" onClick={tryAdminApi}>Try admin-only API</button>
        </div>
        {result && <Message type={result.type}>{result.text}</Message>}
      </section>
    </main>
  );
}
