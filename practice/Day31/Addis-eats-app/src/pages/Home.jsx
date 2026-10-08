import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="home-page">
      <div className="hero-content">
        <h2>Welcome to Addis Eats 🍽️</h2>

        <p>
          Discover delicious Ethiopian dishes and have them delivered to your
          door.
        </p>

        <Link className="primary-link" to="/menu">
          Browse Our Menu
        </Link>
      </div>

      <div className="home-features">
        <div className="feature">
          <h3>🇪🇹 Ethiopian Food</h3>
          <p>Enjoy traditional Ethiopian favorites.</p>
        </div>

        <div className="feature">
          <h3>🚚 Fast Delivery</h3>
          <p>Get your favorite dishes delivered.</p>
        </div>

        <div className="feature">
          <h3>📱 TeleBirr</h3>
          <p>Convenient delivery information.</p>
        </div>
      </div>
    </section>
  );
}

export default Home;
