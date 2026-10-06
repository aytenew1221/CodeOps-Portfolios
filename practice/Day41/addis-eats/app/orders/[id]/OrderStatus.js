"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const statusStyles = {
  Pending: "bg-gray-100 text-gray-700",
  Preparing: "bg-amber-100 text-amber-800",
  Ready: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
};

export default function OrderStatus({ id, initialOrder }) {
  const [updating, setUpdating] = useState(false);

  const { data, error, isValidating, mutate } = useSWR(
    `/api/orders/${id}`,
    fetcher,
    {
      fallbackData: { success: true, order: initialOrder },
      refreshInterval: 5000,
      revalidateOnFocus: true,
    },
  );

  async function simulateStatusUpdate() {
    setUpdating(true);

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Could not update order");
      }

      await mutate();
    } catch (updateError) {
      console.error(updateError);
    } finally {
      setUpdating(false);
    }
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Could not load the order.
      </div>
    );
  }

  const order = data?.order;

  return (
    <div className="rounded-3xl border bg-white p-7 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm text-gray-500">Order #{order?.id}</p>
          <h2 className="mt-2 text-3xl font-extrabold">{order?.customer}</h2>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-bold ${
            statusStyles[order?.status] || statusStyles.Pending
          }`}
        >
          {order?.status}
        </span>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Order total</p>
          <p className="mt-1 text-xl font-bold">{order?.total} ETB</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Items</p>
          <p className="mt-1 font-semibold">{order?.items?.join(", ")}</p>
        </div>
      </div>

      <div className="mt-7 rounded-xl bg-purple-50 p-4 text-sm text-purple-900">
        <p className="font-semibold">Live status</p>
        <p className="mt-1">
          SWR checks this order every 5 seconds. Open the browser Network tab to
          observe the repeated GET request.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={simulateStatusUpdate}
          disabled={updating || order?.status === "Delivered"}
          className="rounded-xl bg-purple-700 px-5 py-3 font-semibold text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updating ? "Updating…" : "Simulate kitchen update"}
        </button>

        <span className="text-sm text-gray-500">
          {isValidating ? "Checking for new status…" : "Waiting for next check"}
        </span>
      </div>
    </div>
  );
}
