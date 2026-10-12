import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="page narrow center-text">
      <h1>Page not found</h1>
      <p><Link to="/">Go home</Link></p>
    </main>
  );
}
