"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function CartBadge() {
  const { data } = useSWR("/api/cart", fetcher);

  const count =
    data?.data?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <span>
      Cart{" "}
      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
        {count}
      </span>
    </span>
  );
}
