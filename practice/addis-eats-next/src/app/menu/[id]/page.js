import Link from "next/link";
import { notFound } from "next/navigation";

const dishes = {
  "doro-wat": {
    name: "Doro Wat",
    price: 350,
    description: "Spicy Ethiopian chicken stew served with injera.",
  },

  shiro: {
    name: "Shiro",
    price: 180,
    description: "Traditional Ethiopian chickpea stew.",
  },

  "misir-wat": {
    name: "Misir Wat",
    price: 160,
    description: "Spicy Ethiopian red lentil stew.",
  },

  kitfo: {
    name: "Kitfo",
    price: 320,
    description: "Traditional Ethiopian minced beef dish.",
  },
};

export default async function DishPage({ params }) {
  const { id } = await params;

  const dish = dishes[id];

  if (!dish) {
    notFound();
  }

  return (
    <section>
      <h1>{dish.name}</h1>

      <p>{dish.description}</p>

      <p>Price: {dish.price} ETB</p>

      <Link href="/menu">← Back to Menu</Link>
    </section>
  );
}
