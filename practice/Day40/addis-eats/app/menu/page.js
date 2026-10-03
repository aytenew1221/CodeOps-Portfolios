import Link from "next/link";
import { getDishes, getDishesByCategory } from "../../lib/dishes";

export const revalidate = 60;

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const category = params?.category;

  const dishes = category
    ? await getDishesByCategory(category)
    : await getDishes();

  return (
    <section>
      <h1>Our Menu</h1>

      {category && (
        <p>
          Showing category: <strong>{category}</strong>
        </p>
      )}

      {dishes.length === 0 ? (
        <p>No dishes found in this category.</p>
      ) : (
        <div className="menu-grid">
          {dishes.map((dish) => (
            <article className="dish-card" key={dish.id}>
              <span className="category">{dish.category}</span>

              <h2>{dish.name}</h2>

              <p>{dish.description}</p>

              <p className="price">{dish.price} ETB</p>

              <Link href={`/menu/${dish.id}`} className="view-link">
                View Dish →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
