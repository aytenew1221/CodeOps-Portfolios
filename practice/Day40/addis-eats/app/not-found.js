import Link from "next/link";

export default function NotFound() {
  return (
    <section className="dish-detail">
      <h1>Dish Not Found</h1>

      <p>Sorry, the dish you requested does not exist.</p>

      <Link href="/menu" className="view-link">
        ← Return to Menu
      </Link>
    </section>
  );
}
