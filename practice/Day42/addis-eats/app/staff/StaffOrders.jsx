"use client";

import { useState } from "react";

export default function StaffOrders({ orders }) {
  const [items, setItems] = useState(orders);

  const [loadingId, setLoadingId] = useState(null);

  async function advanceOrder(id) {
    setLoadingId(id);

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not update order.");

        return;
      }

      setItems((current) =>
        current.map((order) => (order.id === id ? data.order : order)),
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="mt-8 space-y-5">
      {items.map((order) => (
        <div
          key={order.id}
          className="rounded-2xl border bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Order #{order.id}</h2>

              <p className="text-gray-600">Customer: {order.customer}</p>
            </div>

            <span className="rounded-full bg-purple-100 px-3 py-1 font-semibold text-purple-700">
              {order.status}
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="font-bold">{order.total} ETB</span>

            <button
              onClick={() => advanceOrder(order.id)}
              disabled={loadingId === order.id || order.status === "Delivered"}
              className="rounded-lg bg-purple-700 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loadingId === order.id ? "Updating..." : "Advance Status"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
