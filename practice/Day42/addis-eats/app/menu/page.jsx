import SearchBox from "./SearchBox";

export const metadata = {
  title: "Menu | Addis Eats",
};

export default function MenuPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-700">
          Public Menu
        </p>

        <h1 className="mt-2 text-4xl font-extrabold">Addis Eats Menu</h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Browse Ethiopian dishes. Sign in when you want to add dishes to your
          personal cart.
        </p>
      </div>

      <SearchBox />
    </main>
  );
}
