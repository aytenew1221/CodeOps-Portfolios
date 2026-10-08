/*
  This file is part of Addis Eats Application receipt page.
 */
import { Link } from "react-router-dom";

export default function Receipt() {
  let order = null;

  try {
    order = JSON.parse(localStorage.getItem("addis-eats-last-order"));
  } catch {
    order = null;
  }

  return (
    <section className="page narrow">
      <div className="success-box">
        <span className="eyebrow">ORDER COMPLETE</span>

        <h1>Thank you! 🎉</h1>

        {order ? (
          <>
            <p>
              Order number: <strong>{order.id}</strong>
            </p>

            <p>
              Total: <strong>{order.total.toLocaleString()} ETB</strong>
            </p>

            <p>Delivery to: {order.address}</p>
          </>
        ) : (
          <p>No recent order was found.</p>
        )}

        <Link className="button" to="/menu">
          Order again
        </Link>
      </div>
    </section>
  );
}
