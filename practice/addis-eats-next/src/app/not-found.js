import Link from "next/link";

export default function NotFound() {
  return (
    <section>
      <h1>404 - Dish Not Found</h1>
      <p>Sorry, the page or dish you requested does not exist.</p>
      <Link href="/">Go Home</Link> <Link href="/menu">View Menu</Link>
    </section>
  );
}
