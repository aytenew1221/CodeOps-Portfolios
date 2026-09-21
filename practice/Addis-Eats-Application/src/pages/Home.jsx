/*
  This file is part of Addis Eats Application.
 */
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="page hero">
      <div>
        <span className="eyebrow">ETHIOPIAN FOOD · FAST DELIVERY</span>

        <h1>Welcome to Addis Eats</h1>

        <p>
          Explore Ethiopian favorites, add dishes to your cart, and experience a
          resilient React application.
        </p>

        <Link className="button" to="/menu">
          Explore Menu
        </Link>
      </div>

      <div className="hero-card">
        <span>Today's idea</span>

        <h2>Try Doro Wat 🍗</h2>

        <p>
          Use Quick View to test the portal modal and Escape-to-close behavior.
        </p>

        <Link className="button secondary" to="/menu">
          View Menu
        </Link>
      </div>
    </section>
  );
}
