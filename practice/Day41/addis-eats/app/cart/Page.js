import Cart from "./Cart";

export const metadata = {
  title: "Cart | Addis Eats",
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-purple-700">
        SWR Mutation
      </p>

      <h1 className="mt-2 text-4xl font-extrabold">Your Cart</h1>

      <p className="mt-3 mb-8 text-gray-600">
        The cart is read with SWR and refreshed after mutations.
      </p>

      <Cart />
    </main>
  );
}
