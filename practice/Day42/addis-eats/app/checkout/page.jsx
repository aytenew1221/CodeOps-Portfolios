import CheckoutForm from "./CheckoutForm";

export const metadata = {
  title: "Checkout | Addis Eats",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-purple-700">
        Protected Page
      </p>

      <h1 className="mt-2 text-4xl font-extrabold">Checkout</h1>

      <p className="mt-3 text-gray-600">
        Review your order and create your personal order.
      </p>

      <CheckoutForm />
    </main>
  );
}
