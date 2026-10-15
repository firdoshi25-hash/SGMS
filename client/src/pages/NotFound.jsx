import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found-page">
      <p>404</p>
      <h1>Page not found</h1>
      <Link className="primary-button" to="/">
        Return home
      </Link>
    </main>
  );
}

export default NotFound;