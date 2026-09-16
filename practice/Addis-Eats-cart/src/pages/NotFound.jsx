import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="not-found">
      <h1>404</h1>

      <h2>Page Not Found</h2>

      <p>The page you requested does not exist.</p>

      <Link className="button" to="/">
        Go Home
      </Link>
    </section>
  );
}

export default NotFound;
