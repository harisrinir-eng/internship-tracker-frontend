export default function InternshipCard({ internship, onDelete }) {
  return (
    <article className="card">
      <h3>{internship.title}</h3>
      <p className="company">{internship.company}</p>
      <p>📍 {internship.location}</p>
      <p><span className="tag">{internship.category}</span></p>
      {internship.description && <p className="muted">{internship.description}</p>}
      {/* This button only exists for admins - but hiding it is NOT security.
          The server still returns 403 if a student sends the DELETE request. */}
      {onDelete && (
        <button className="btn btn-danger" onClick={() => onDelete(internship)}>
          Delete
        </button>
      )}
    </article>
  );
}
