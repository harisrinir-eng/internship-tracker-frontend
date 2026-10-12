import { useEffect, useState } from "react";
import Message from "../components/Message.jsx";
import { createInternship, deleteInternship, getAllUsers, getInternships } from "../services/api.js";

const EMPTY_FORM = { title: "", company: "", location: "", category: "", description: "" };

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [internships, setInternships] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [details, setDetails] = useState([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [userData, internshipData] = await Promise.all([getAllUsers(), getInternships()]);
      setUsers(userData.users);
      setInternships(internshipData.internships);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleCreate(event) {
    event.preventDefault();
    setError("");
    setDetails([]);
    setNotice("");
    try {
      const data = await createInternship(form);
      setNotice(data.message);
      setForm(EMPTY_FORM);
      loadData();
    } catch (err) {
      setError(err.message);
      setDetails(err.details || []);
    }
  }

  async function handleDelete(internship) {
    setError("");
    setNotice("");
    try {
      await deleteInternship(internship._id);
      setNotice(`Deleted "${internship.title}".`);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page">
      <h1>Admin Dashboard</h1>
      <Message type="error" title={error || undefined}>
        {details.length > 0 && <ul>{details.map((d) => <li key={d}>{d}</li>)}</ul>}
      </Message>
      <Message type="success">{notice}</Message>
      {loading && <p className="center-text">Loading...</p>}

      <section className="panel">
        <h2>Add an internship</h2>
        <form className="form form-grid" onSubmit={handleCreate} noValidate>
          <input name="title" placeholder="Title" value={form.title} onChange={updateField} aria-label="Title" />
          <input name="company" placeholder="Company" value={form.company} onChange={updateField} aria-label="Company" />
          <input name="location" placeholder="Location" value={form.location} onChange={updateField} aria-label="Location" />
          <input name="category" placeholder="Technology (e.g. React)" value={form.category} onChange={updateField} aria-label="Technology" />
          <input name="description" placeholder="Short description (optional)" value={form.description} onChange={updateField} aria-label="Description" />
          <button className="btn" type="submit">Create</button>
        </form>
      </section>

      <section className="panel">
        <h2>Manage internships ({internships.length})</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Title</th><th>Company</th><th>Location</th><th>Technology</th><th></th></tr>
            </thead>
            <tbody>
              {internships.map((i) => (
                <tr key={i._id}>
                  <td>{i.title}</td>
                  <td>{i.company}</td>
                  <td>{i.location}</td>
                  <td>{i.category}</td>
                  <td><button className="btn btn-danger btn-small" onClick={() => handleDelete(i)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Registered users ({users.length})</h2>
        <p className="muted">This list comes from the admin-only API. Notice: no passwords or hashes.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={"role-badge role-" + u.role}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
