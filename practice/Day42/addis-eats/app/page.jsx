import Link from "next/link";
import { dishes } from "@/lib/dishes";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featured = dishes.slice(0, 6);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <section className="rounded-3xl bg-purple-700 px-8 py-16 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-200">
          Secure Food Ordering
        </p>

        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold md:text-6xl">
          Ethiopian food, securely ordered.
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-purple-100">
          Addis Eats now supports authentication, authorization, user-specific
          carts, protected orders and staff-only order management.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/menu"
            className="rounded-lg bg-white px-5 py-3 font-semibold text-purple-700 hover:bg-purple-50"
          >
            Explore Menu
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-purple-300 px-5 py-3 font-semibold hover:bg-purple-600"
          >
            Sign In
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Featured dishes</h2>

          <p className="mt-1 text-gray-600">
            Browse the menu before signing in.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((dish) => (
            <article
              key={dish.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                  {dish.category}
                </span>

                <span className="font-bold">{dish.price} ETB</span>
              </div>

              <h3 className="text-xl font-bold">{dish.name}</h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {dish.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
