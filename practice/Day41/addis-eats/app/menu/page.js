import SearchBox from "./SearchBox";

export const metadata = {
  title: "Menu | Addis Eats",
};

export default function MenuPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-700">
          SWR Search + Pagination
        </p>
        <h1 className="mt-2 text-4xl font-extrabold">Addis Eats Menu</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Type a search, change category, and move between pages. Requests are
          debounced and previous results remain visible during updates.
        </p>
      </div>

      <SearchBox />
    </main>
  );
}
