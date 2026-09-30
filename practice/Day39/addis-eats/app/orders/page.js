import { orders } from "@/lib/orders";
import { cancelOrder } from "@/app/actions";

export const metadata = {
  title: "Orders | Addis Eats",
  description: "View Addis Eats orders.",
};

export default function OrdersPage() {
  return (
    <main>
      <h1>Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <article key={order.id}>
              <h2>{order.dishName}</h2>

              <p>Order ID: {order.id}</p>

              <p>Customer: {order.name}</p>

              <p>Phone: {order.phone}</p>

              <p>
                Total: {order.total} {order.currency}
              </p>

              <p>Status: {order.status}</p>

              {order.status !== "cancelled" && (
                <form action={cancelOrder}>
                  <input type="hidden" name="orderId" value={order.id} />

                  <button type="submit">Cancel Order</button>
                </form>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
