import Link from "next/link";
import { dishes } from "@/lib/dishes";

export default function HomePage() {
  return (
    <main>
      <h1>Addis Eats</h1>

      <p>Welcome to Addis Eats.</p>

      <p>Explore Ethiopian food and place your order online.</p>

      <nav>
        <Link href="/menu">View Menu</Link>

        {" | "}

        <Link href="/checkout">Checkout</Link>

        {" | "}

        <Link href="/orders">Orders</Link>
      </nav>

      <section>
        <h2>Today's Menu</h2>

        {dishes.map((dish) => (
          <article key={dish.id}>
            <h3>{dish.name}</h3>

            <p>{dish.category}</p>

            <p>{dish.price} ETB</p>
          </article>
        ))}
      </section>
    </main>
  );
}
