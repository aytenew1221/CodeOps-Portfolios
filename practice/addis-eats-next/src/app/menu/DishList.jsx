import Link from "next/link";

const dishes = [
  {
    id: "doro-wat",
    name: "Doro Wat",
    price: 350,
    category: "Main",
  },
  {
    id: "shiro",
    name: "Shiro",
    price: 180,
    category: "Main",
  },
  {
    id: "misir-wat",
    name: "Misir Wat",
    price: 160,
    category: "Main",
  },
  {
    id: "kitfo",
    name: "Kitfo",
    price: 320,
    category: "Main",
  },
];

export default function DishList() {
  return (
    <div>
      {dishes.map((dish) => (
        <article key={dish.id}>
          <h2>{dish.name}</h2>

          <p>Category: {dish.category}</p>

          <p>Price: {dish.price} ETB</p>

          <Link href={`/menu/${dish.id}`}>View Dish</Link>
        </article>
      ))}
    </div>
  );
}
