import Link from "next/link";

export default function Home() {
  return (
    <section>
      <h1>🍽️ Addis Eats</h1>

      <p>Welcome to Addis Eats.</p>

      <p>Discover delicious Ethiopian food and place your order.</p>

      <Link href="/menu">View Menu</Link>
    </section>
  );
}
