import { getOrder } from "@/lib/orders-api";
import OrderStatus from "./OrderStatus";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">Order not found</h1>
        <p className="mt-2 text-gray-600">No order exists with ID #{id}.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-purple-700">
        {/* SWR + fallbackData + polling */}
      </p>
      <h1 className="mt-2 mb-7 text-4xl font-extrabold">Order Status</h1>

      <OrderStatus id={id} initialOrder={order} />
    </main>
  );
}
