import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="not-found">
      <h2>404</h2>

      <h3>Page Not Found</h3>

      <p>Sorry, the page you are looking for does not exist.</p>

      <Link className="primary-link" to="/">
        Go Home
      </Link>
    </section>
  );
}

export default NotFound;
