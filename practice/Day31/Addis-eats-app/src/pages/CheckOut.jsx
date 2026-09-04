import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Checkout({ cart, cartTotal, onClear }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const telebirrPattern = /^(?:\+251|0)9\d{8}$/;

  const isNameValid = formData.name.trim().length >= 2;

  const isPhoneValid = telebirrPattern.test(formData.phone.trim());

  const isAreaValid = formData.area.trim().length >= 2;

  const isFormValid =
    isNameValid && isPhoneValid && isAreaValid && cart.length > 0;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    setSubmitted(true);

    onClear();
  };

  if (cart.length === 0 && !submitted) {
    return (
      <section className="checkout-page">
        <h2>Checkout</h2>

        <div className="empty-state">
          <p>Your cart is empty.</p>

          <Link className="primary-link" to="/menu">
            Browse Menu
          </Link>
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="checkout-page">
        <div className="success-card">
          <h2>Order Submitted! 🎉</h2>

          <p>
            Your Addis Eats delivery information was submitted successfully.
          </p>

          <button type="button" onClick={() => navigate("/")}>
            Back Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-layout">
        <div className="checkout-order">
          <h3>Your Order</h3>

          {cart.map((item) => (
            <div className="checkout-item" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                {(item.price * item.quantity).toLocaleString()} ETB
              </strong>
            </div>
          ))}

          <hr />

          <h3>Total: {cartTotal.toLocaleString()} ETB</h3>
        </div>

        <div className="delivery-section">
          <h3>Delivery Information</h3>

          <form onSubmit={handleSubmit}>
            <label htmlFor="delivery-name">Full Name</label>

            <input
              id="delivery-name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

            <label htmlFor="delivery-phone">TeleBirr Phone Number</label>

            <input
              id="delivery-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="09xxxxxxxx or +2519xxxxxxxx"
            />

            {formData.phone && !isPhoneValid && (
              <p className="error">Enter a valid Ethiopian TeleBirr number.</p>
            )}

            <label htmlFor="delivery-area">Delivery Area</label>

            <input
              id="delivery-area"
              name="area"
              type="text"
              autoComplete="address-level2"
              value={formData.area}
              onChange={handleChange}
              placeholder="e.g. Bole, Addis Ababa"
            />

            <button type="submit" disabled={!isFormValid}>
              Place Delivery Order
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
