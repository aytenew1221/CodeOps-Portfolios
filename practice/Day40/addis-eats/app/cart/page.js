import CartClient from "../../components/CartClient";

export default function CartPage() {
  return (
    <section className="cart-page">
      <h1>Your Cart</h1>

      <p>Review your selected dishes before checkout.</p>

      <CartClient />
    </section>
  );
}
