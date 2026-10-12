import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <main className="page narrow center-text">
      <h1>🚫 Access Denied</h1>
      <p>Your account does not have permission to open that page.</p>
      <p><Link to="/internships">Back to internships</Link></p>
    </main>
  );
}
