import TanStackMenu from "./TanStackMenu";
import TanStackCartSummary from "./TanStackCartSummary";

export const metadata = {
  title: "TanStack Query Demo | Addis Eats",
};

export default function TanStackPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-700">
          TanStack Query
        </p>
        <h1 className="mt-2 text-4xl font-extrabold">
          Queries, mutations and invalidation
        </h1>
        <p className="mt-3 max-w-3xl text-gray-600">
          This page demonstrates useQuery, structured query keys, staleTime,
          useMutation and invalidateQueries.
        </p>
      </div>

      <TanStackCartSummary />
      <TanStackMenu />
    </main>
  );
}
