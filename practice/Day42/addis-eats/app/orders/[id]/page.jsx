import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getOrder } from "@/lib/orders";
import { notFound, redirect } from "next/navigation";

export default async function OrderPage({ params }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const order = getOrder(id);

  if (!order) {
    notFound();
  }

  if (user.role !== "staff" && order.userId !== user.id) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-bold text-red-700">Access denied</h1>

          <p className="mt-2 text-red-600">
            This order belongs to another customer.
          </p>

          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-purple-700 px-4 py-2 text-white"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-purple-700">
        Order Tracking
      </p>

      <h1 className="mt-2 text-4xl font-extrabold">Order #{order.id}</h1>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex justify-between">
          <span className="font-semibold">Customer</span>

          <span>{order.customer}</span>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="font-semibold">Status</span>

          <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-700">
            {order.status}
          </span>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="font-semibold">Total</span>

          <span className="font-bold">{order.total} ETB</span>
        </div>

        <div className="mt-6 border-t pt-5">
          <h2 className="font-bold">Items</h2>

          <div className="mt-3 space-y-2">
            {order.items.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex justify-between"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>{item.price * item.quantity} ETB</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="mt-6 inline-block font-semibold text-purple-700"
      >
        ← Back to Home
      </Link>
    </main>
  );
}
