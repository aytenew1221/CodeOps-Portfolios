import Cart from "./Cart";

export const metadata = {
  title: "Cart | Addis Eats",
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-purple-700">
        Protected Page
      </p>

      <h1 className="mt-2 text-4xl font-extrabold">Your Cart</h1>

      <p className="mt-3 mb-8 text-gray-600">
        Your cart belongs only to your account.
      </p>

      <Cart />
    </main>
  );
}
