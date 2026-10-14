"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";

import { fetcher } from "@/lib/fetcher";
import { clearCart } from "@/lib/cart-api";

export default function Cart() {
  const router = useRouter();

  const { data, error, isLoading, mutate } = useSWR("/api/cart", fetcher);

  async function handleClear() {
    try {
      await clearCart();
      mutate();
    } catch (error) {
      if (error.message.includes("Authentication")) {
        router.push("/login");
      }
    }
  }

  if (isLoading && !data) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        {error.message}
        <div className="mt-4">
          <button
            onClick={() => router.push("/login")}
            className="rounded-lg bg-purple-700 px-4 py-2 text-white"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const items = data?.data || [];

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <section>
      {items.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-xl font-semibold">Your cart is empty.</p>

          <p className="mt-2 text-gray-600">Add a dish from the menu.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border bg-white p-5"
              >
                <div>
                  <h2 className="font-bold">{item.name}</h2>

                  <p className="text-sm text-gray-500">
                    {item.quantity} × {item.price} ETB
                  </p>
                </div>

                <p className="font-bold">{item.quantity * item.price} ETB</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl border bg-white p-5">
            <span className="text-lg font-bold">Total</span>

            <span className="text-2xl font-extrabold">{total} ETB</span>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-700 hover:bg-red-50"
            >
              Clear Cart
            </button>

            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="rounded-xl bg-purple-700 px-5 py-3 font-semibold text-white hover:bg-purple-800"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}
