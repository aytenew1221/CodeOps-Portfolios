import Link from "next/link";

export default function CheckoutPage() {
  return (
    <section>
      <h1>Checkout</h1>

      <p>Complete your delivery information.</p>

      <form>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" />
        </div>

        <div>
          <label htmlFor="phone">TeleBirr Phone</label>
          <input id="phone" name="phone" />
        </div>

        <div>
          <label htmlFor="area">Delivery Area</label>
          <input id="area" name="area" />
        </div>

        <button type="submit">Place Order</button>
      </form>

      <br />

      <Link href="/cart">Back to Cart</Link>
    </section>
  );
}
