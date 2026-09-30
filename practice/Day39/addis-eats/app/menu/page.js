import Link from "next/link";
import { dishes } from "@/lib/dishes";

export const metadata = {
  title: "Menu | Addis Eats",
  description: "Browse Ethiopian dishes from Addis Eats.",
};

export default function MenuPage() {
  return (
    <main>
      <h1>Our Menu</h1>

      <div>
        {dishes.map((dish) => (
          <article key={dish.id}>
            <h2>{dish.name}</h2>

            <p>Category: {dish.category}</p>

            <p>Price: {dish.price} ETB</p>

            <Link href={`/checkout?dish=${dish.id}`}>Order this dish</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
