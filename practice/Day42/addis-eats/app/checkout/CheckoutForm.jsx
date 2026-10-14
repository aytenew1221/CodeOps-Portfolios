"use client";

import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";

import { fetcher } from "@/lib/fetcher";

export default function CheckoutForm() {
  const router = useRouter();

  const { data, error, isLoading } = useSWR("/api/cart", fetcher);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not create order.");
      }

      router.push(`/orders/${result.order.id}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return <p>Loading checkout...</p>;
  }

  if (error) {
    return (
      <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        {error.message}
      </div>
    );
  }

  const items = data?.data || [];

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border bg-white p-8">
        <p className="font-semibold">Your cart is empty.</p>

        <button
          onClick={() => router.push("/menu")}
          className="mt-4 rounded-lg bg-purple-700 px-4 py-2 text-white"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border bg-white p-6"
    >
      {message && (
        <div className="mb-5 rounded-xl bg-red-50 p-4 text-red-700">
          {message}
        </div>
      )}

      <h2 className="text-xl font-bold">Order summary</h2>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>{item.price * item.quantity} ETB</span>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-5">
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>{total} ETB</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-purple-700 px-5 py-3 font-bold text-white hover:bg-purple-800 disabled:opacity-50"
      >
        {loading ? "Creating Order..." : "Place Order"}
      </button>
    </form>
  );
}
