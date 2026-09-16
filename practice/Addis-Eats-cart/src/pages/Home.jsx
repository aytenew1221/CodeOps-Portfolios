import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero">
      <h1>Welcome to Addis Eats</h1>

      <p>Discover delicious Ethiopian food and order your favorite dishes.</p>

      <Link className="button" to="/menu">
        Explore Menu
      </Link>
    </section>
  );
}

export default Home;
