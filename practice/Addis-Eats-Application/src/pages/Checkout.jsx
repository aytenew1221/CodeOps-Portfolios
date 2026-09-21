/*
  This file is part of Addis Eats Application.
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const BANKS = [
  {
    value: "Bank of Abyssinia",
    label: "Bank of Abyssinia",
    minLength: 10,
    maxLength: 16,
  },
  {
    value: "CBE",
    label: "Commercial Bank of Ethiopia (CBE)",
    minLength: 10,
    maxLength: 16,
  },
  {
    value: "Dashen Bank",
    label: "Dashen Bank",
    minLength: 10,
    maxLength: 16,
  },
  {
    value: "Abay Bank",
    label: "Abay Bank",
    minLength: 10,
    maxLength: 16,
  },
];

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("Telebirr");
  const [selectedBank, setSelectedBank] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const delivery = useMemo(() => (cartTotal >= 5000 ? 0 : 200), [cartTotal]);

  const grandTotal = cartTotal + delivery;

  function handlePaymentChange(event) {
    setPaymentMethod(event.target.value);
    setPaymentError("");
    setSelectedBank("");
  }

  function handleBankChange(event) {
    setSelectedBank(event.target.value);
    setPaymentError("");
  }

  function validatePayment(form) {
    if (paymentMethod === "Telebirr") {
      const telebirrPhone = String(form.get("telebirrPhone") || "").trim();

      const telebirrPattern = /^(?:\+251|0)9\d{8}$/;

      if (!telebirrPattern.test(telebirrPhone)) {
        return "Please enter a valid Telebirr phone number, for example 0912345678.";
      }
    }

    if (paymentMethod === "Bank") {
      if (!selectedBank) {
        return "Please select your bank.";
      }

      const bank = BANKS.find((item) => item.value === selectedBank);

      const accountNumber = String(form.get("accountNumber") || "").trim();

      if (!/^\d+$/.test(accountNumber)) {
        return "Bank account number must contain numbers only.";
      }

      if (
        accountNumber.length < bank.minLength ||
        accountNumber.length > bank.maxLength
      ) {
        return `${bank.label} account number must contain ${bank.minLength}-${bank.maxLength} digits.`;
      }
    }

    return "";
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const form = new FormData(event.currentTarget);

    const validationError = validatePayment(form);

    if (validationError) {
      setPaymentError(validationError);
      return;
    }

    const order = {
      id: `AE-${Date.now()}`,

      customer: String(form.get("name")).trim(),

      phone: String(form.get("phone")).trim(),

      address: String(form.get("address")).trim(),

      paymentMethod,

      telebirrPhone:
        paymentMethod === "Telebirr"
          ? String(form.get("telebirrPhone")).trim()
          : null,

      bank: paymentMethod === "Bank" ? selectedBank : null,

      accountNumber:
        paymentMethod === "Bank"
          ? String(form.get("accountNumber")).trim()
          : null,

      items: cart,

      subtotal: cartTotal,

      delivery,

      total: grandTotal,

      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("addis-eats-last-order", JSON.stringify(order));

    clearCart();

    navigate("/receipt");
  }

  return (
    <section className="page">
      <span className="eyebrow">CHECKOUT</span>

      <h1>Complete your order</h1>

      <p>
        Signed in as <strong>{user?.name}</strong>.
      </p>

      <div className="checkout-grid">
        <form className="form-card" onSubmit={handleSubmit}>
          {/* Customer name */}
          <label>
            Name
            <input
              name="name"
              defaultValue={user?.name || ""}
              placeholder="Your full name"
              autoComplete="name"
              required
            />
          </label>

          {/* Contact phone */}
          <label>
            Phone
            <input
              name="phone"
              type="tel"
              placeholder="0912345678"
              pattern="^(?:\+251|0)9\d{8}$"
              title="Enter a valid Ethiopian phone number, for example 0912345678"
              autoComplete="tel"
              required
            />
          </label>

          {/* Delivery address */}
          <label>
            Delivery address
            <textarea name="address" required placeholder="Bole, Addis Ababa" />
          </label>

          {/* Payment method */}
          <label>
            Payment method
            <select
              name="paymentMethod"
              value={paymentMethod}
              onChange={handlePaymentChange}
              required
            >
              <option value="Telebirr">Telebirr</option>
              <option value="Bank">Bank</option>
              <option value="Cash on delivery">Cash on delivery</option>
            </select>
          </label>

          {/* TELEBIRR */}
          {paymentMethod === "Telebirr" && (
            <div className="payment-section">
              <h3>Telebirr payment</h3>

              <label>
                Telebirr phone number
                <input
                  name="telebirrPhone"
                  type="tel"
                  placeholder="0912345678"
                  pattern="^(?:\+251|0)9\d{8}$"
                  title="Enter a valid Telebirr number, for example 0912345678"
                  autoComplete="tel"
                  required
                />
              </label>

              <small className="muted">
                Enter the phone number registered with Telebirr.
              </small>
            </div>
          )}

          {/* BANK */}
          {paymentMethod === "Bank" && (
            <div className="payment-section">
              <h3>Bank payment</h3>

              <label>
                Select bank
                <select
                  name="bank"
                  value={selectedBank}
                  onChange={handleBankChange}
                  required
                >
                  <option value="">-- Select your bank --</option>

                  {BANKS.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </select>
              </label>

              {selectedBank && (
                <label>
                  Bank account number
                  <input
                    name="accountNumber"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{10,16}"
                    minLength={10}
                    maxLength={16}
                    placeholder="Enter account number"
                    title="Account number must contain 10 to 16 digits"
                    required
                  />
                  <small className="muted">
                    Enter your {selectedBank} account number using numbers only.
                  </small>
                </label>
              )}
            </div>
          )}

          {/* Validation error */}
          {paymentError && (
            <div className="error-box" role="alert">
              <p>{paymentError}</p>
            </div>
          )}

          {/* Submit */}
          <button className="button full" type="submit">
            Place order · {grandTotal.toLocaleString()} ETB
          </button>
        </form>

        {/* ORDER SUMMARY */}
        <aside className="summary">
          <h2>Order summary</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div className="summary-row" key={item.id}>
                <span>
                  {item.name} × {item.quantity}
                </span>

                <strong>
                  {(item.price * item.quantity).toLocaleString()} ETB
                </strong>
              </div>
            ))
          )}

          <hr />

          <div className="summary-row">
            <span>Subtotal</span>

            <strong>{cartTotal.toLocaleString()} ETB</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>

            <strong>{delivery.toLocaleString()} ETB</strong>
          </div>

          <div className="summary-row total">
            <span>Total</span>

            <strong>{grandTotal.toLocaleString()} ETB</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
