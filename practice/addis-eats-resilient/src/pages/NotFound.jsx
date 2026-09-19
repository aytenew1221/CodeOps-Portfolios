import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page narrow">
      <div className="error-box">
        <h1>404</h1>

        <h2>Page not found</h2>

        <p>The route you requested does not exist.</p>

        <Link className="button" to="/">
          Go home
        </Link>
      </div>
    </section>
  );
}
