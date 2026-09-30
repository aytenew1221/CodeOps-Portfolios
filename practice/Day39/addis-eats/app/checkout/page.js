import CheckoutForm from "./checkout-form";

export const metadata = {
  title: "Checkout | Addis Eats",
  description: "Complete your Addis Eats order.",
};

export default async function CheckoutPage({ searchParams }) {
  const params = await searchParams;
  const selectedDish = params?.dish || "";

  return (
    <main>
      <h1>Checkout</h1>

      <p>Complete the form below to place your Addis Eats order.</p>

      <CheckoutForm selectedDish={selectedDish} />
    </main>
  );
}
