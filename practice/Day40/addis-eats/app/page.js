import Link from "next/link";

export default function HomePage() {
  return (
    <section className="hero">
      <h1>Welcome to Addis Eats 🍽️</h1>

      <p>
        Discover delicious Ethiopian food and order your favorite dishes from
        the comfort of your home.
      </p>

      <Link href="/menu" className="primary-button">
        Explore Our Menu
      </Link>
    </section>
  );
}
