"use client";

import { useQuery } from "@tanstack/react-query";
import AddToCartButton from "../menu/AddToCartButton";

async function getDishes() {
  const response = await fetch("/api/dishes?limit=12");

  if (!response.ok) {
    throw new Error("Failed to fetch dishes");
  }

  return response.json();
}

export default function TanStackMenu() {
  const { data, error, isPending, isFetching } = useQuery({
    queryKey: ["dishes", "all"],
    queryFn: getDishes,
    staleTime: 30 * 1000,
  });

  if (isPending) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center">
        Loading TanStack Query data…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
        Could not load menu.
      </div>
    );
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-gray-500">queryKey: ["dishes", "all"]</p>
        {isFetching && (
          <span className="text-sm font-semibold text-purple-700">
            Refreshing…
          </span>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.data.map((dish) => (
          <article
            key={dish.id}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
              {dish.category}
            </span>
            <h2 className="mt-4 text-xl font-bold">{dish.name}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {dish.description}
            </p>
            <p className="mt-4 font-extrabold">{dish.price} ETB</p>
            <AddToCartButton dish={dish} />
          </article>
        ))}
      </div>
    </section>
  );
}
