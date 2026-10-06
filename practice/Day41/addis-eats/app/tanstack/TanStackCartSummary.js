"use client";

import { useQuery } from "@tanstack/react-query";

async function getCart() {
  const response = await fetch("/api/cart");

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  return response.json();
}

export default function TanStackCartSummary() {
  const { data, isPending, error } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    staleTime: 0,
  });

  if (isPending) {
    return <p className="text-sm text-gray-500">Loading cart summary…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">Could not load cart summary.</p>;
  }

  const items = data?.data || [];
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="mb-8 rounded-2xl border bg-white p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        TanStack Query cart
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg font-bold">
          {count} item{count === 1 ? "" : "s"} · {total} ETB
        </p>
        <p className="text-sm text-gray-500">Invalidated after Add to Cart</p>
      </div>
    </div>
  );
}
