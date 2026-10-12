import { useEffect, useState } from "react";
import InternshipCard from "../components/InternshipCard.jsx";
import Message from "../components/Message.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { deleteInternship, getInternships, getLocations } from "../services/api.js";

export default function Internships() {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Fill the location drop-down once
  useEffect(() => {
    getLocations().then((data) => setLocations(data.locations)).catch(() => {});
  }, []);

  // Re-load the list whenever the search text or location changes.
  // We wait 300 ms after typing stops so we do not send a request for every key press.
  useEffect(() => {
    setLoading(true);
    setError("");
    const timer = setTimeout(() => {
      getInternships({ search, location })
        .then((data) => setInternships(data.internships))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, location]);

  async function handleDelete(internship) {
    setNotice("");
    setError("");
    try {
      await deleteInternship(internship._id);
      setInternships((list) => list.filter((i) => i._id !== internship._id));
      setNotice(`Deleted "${internship.title}".`);
    } catch (err) {
      setError(`${err.status === 403 ? "Permission denied (403)" : "Error"}: ${err.message}`);
    }
  }

  function clearFilters() {
    setSearch("");
    setLocation("");
  }

  return (
    <main className="page">
      <h1>Internships</h1>

      <div className="filters">
        <input
          type="search"
          placeholder="Search title, company or technology..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search internships"
        />
        <select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Filter by location">
          <option value="">All locations</option>
          {locations.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <button className="btn btn-light" onClick={clearFilters}>Clear</button>
      </div>

      <Message type="error">{error}</Message>
      <Message type="success">{notice}</Message>

      {loading && <p className="center-text">Loading internships...</p>}

      {!loading && !error && internships.length === 0 && (
        <p className="center-text">No internships match your search.</p>
      )}

      {!loading && internships.length > 0 && (
        <>
          <p className="muted">{internships.length} internship(s) found</p>
          <section className="grid">
            {internships.map((item) => (
              <InternshipCard
                key={item._id}
                internship={item}
                onDelete={user.role === "admin" ? handleDelete : undefined}
              />
            ))}
          </section>
        </>
      )}
    </main>
  );
}
