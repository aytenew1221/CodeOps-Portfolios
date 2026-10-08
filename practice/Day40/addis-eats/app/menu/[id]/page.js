import Link from "next/link";
import { notFound } from "next/navigation";
import { getDishById, getDishes } from "../../../lib/dishes";

export async function generateStaticParams() {
  const dishes = await getDishes();

  return dishes.map((dish) => ({
    id: dish.id,
  }));
}

export default async function DishPage({ params }) {
  const { id } = await params;

  const dish = await getDishById(id);

  if (!dish) {
    notFound();
  }

  return (
    <article className="dish-detail">
      <span className="category">{dish.category}</span>

      <h1>{dish.name}</h1>

      <p>{dish.description}</p>

      <p className="price">{dish.price} ETB</p>

      <p>Enjoy this delicious Ethiopian dish from Addis Eats.</p>

      <Link href="/menu" className="view-link">
        ← Back to Menu
      </Link>
    </article>
  );
}
