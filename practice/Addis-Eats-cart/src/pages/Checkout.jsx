import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useCartStore } from "../store/cartStore";
import { useAuth } from "../hooks/useAuth";

function Checkout() {
  // Narrow selector 1
  const items = useCartStore((state) => state.items);

  // Narrow selector 2
  const clearCart = useCartStore((state) => state.clearCart);

  const { user } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    area: "",
    notes: "",
  });

  const [error, setError] = useState("");

  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty.");

      return;
    }

    if (!formData.name.trim()) {
      setError("Name is required.");

      return;
    }

    const phoneRegex = /^(?:\+251|0)9\d{8}$/;

    if (!phoneRegex.test(formData.phone)) {
      setError("Enter a valid Ethiopian phone number such as 0912345678.");

      return;
    }

    if (!formData.area.trim()) {
      setError("Delivery area is required.");

      return;
    }

    const order = {
      id: `AE-${Date.now()}`,
      customer: formData,
      items,
      total: cartTotal,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("addis-eats-last-order", JSON.stringify(order));

    clearCart();

    navigate("/order-success");
  };

  if (items.length === 0) {
    return (
      <section>
        <h1>Checkout</h1>

        <p>Your cart is empty.</p>

        <button onClick={() => navigate("/menu")}>Return to Menu</button>
      </section>
    );
  }

  return (
    <section className="form-page">
      <h1>Checkout</h1>

      <div className="checkout-summary">
        <h2>Order Summary</h2>

        {items.map((item) => (
          <p key={item.id}>
            {item.name} × {item.quantity} —{" "}
            {(item.price * item.quantity).toLocaleString()} ETB
          </p>
        ))}

        <strong>Total: {cartTotal.toLocaleString()} ETB</strong>
      </div>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name</label>

        <input
          id="name"
          name="name"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="phone">Phone</label>

        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="0912345678"
          value={formData.phone}
          onChange={handleChange}
        />

        <label htmlFor="area">Delivery Area</label>

        <input
          id="area"
          name="area"
          autoComplete="street-address"
          placeholder="Bole, Addis Ababa"
          value={formData.area}
          onChange={handleChange}
        />

        <label htmlFor="notes">Notes</label>

        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit">Place Order</button>
      </form>
    </section>
  );
}

export default Checkout;
