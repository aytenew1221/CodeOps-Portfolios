import Link from "next/link";

export default function CartPage() {
  return (
    <section>
      <h1>🛒 Your Cart</h1>

      <p>Your selected dishes will appear here.</p>

      <Link href="/menu">Continue Shopping</Link>
    </section>
  );
}
