import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign In | Addis Eats",
};

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-700">
          Addis Eats
        </p>

        <h1 className="mt-2 text-3xl font-extrabold">Sign in</h1>

        <p className="mt-2 text-gray-600">
          Sign in to manage your cart and orders.
        </p>

        <LoginForm />
      </div>
    </main>
  );
}
