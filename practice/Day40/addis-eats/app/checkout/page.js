import CheckoutForm from "../../components/CheckoutForm";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <section className="checkout-page">
      <h1>Checkout</h1>

      <p>Enter your information to place your order.</p>

      <CheckoutForm />
    </section>
  );
}
