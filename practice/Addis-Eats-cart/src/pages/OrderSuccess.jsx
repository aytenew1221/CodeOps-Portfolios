import { Link } from "react-router-dom";

function OrderSuccess() {
  const savedOrder = localStorage.getItem("addis-eats-last-order");

  const order = savedOrder ? JSON.parse(savedOrder) : null;

  return (
    <section className="success-page">
      <h1>✅ Order Successful</h1>

      {order ? (
        <>
          <p>
            Thank you, <strong>{order.customer.name}</strong>.
          </p>

          <p>
            Order number: <strong>{order.id}</strong>
          </p>

          <p>
            Total: <strong>{order.total.toLocaleString()} ETB</strong>
          </p>
        </>
      ) : (
        <p>Your order has been completed.</p>
      )}

      <Link className="button" to="/menu">
        Order More Food
      </Link>
    </section>
  );
}

export default OrderSuccess;
