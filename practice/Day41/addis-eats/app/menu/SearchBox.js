"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useDebounce } from "./useDebounce";

export default function SearchBox({ initialPage = 1 }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const urlPage = Number(searchParams.get("page") || initialPage || 1);

  const [term, setTerm] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(
    Number.isFinite(urlPage) && urlPage > 0 ? urlPage : 1,
  );

  function updateUrl(nextTerm, nextCategory, nextPage) {
    const params = new URLSearchParams();

    if (nextTerm) params.set("q", nextTerm);
    if (nextCategory) params.set("category", nextCategory);
    if (nextPage > 1) params.set("page", String(nextPage));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  const debouncedTerm = useDebounce(term, 300);

  const key = `/api/dishes?q=${encodeURIComponent(
    debouncedTerm,
  )}&category=${encodeURIComponent(category)}&page=${page}&limit=4`;

  const { data, error, isLoading, isValidating } = useSWR(key, fetcher, {
    keepPreviousData: true,
  });

  function changeSearch(value) {
    setTerm(value);
    setPage(1);
    updateUrl(value, category, 1);
  }

  function changeCategory(value) {
    setCategory(value);
    setPage(1);
    updateUrl(term, value, 1);
  }

  return (
    <section>
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_220px]">
        <div>
          <label htmlFor="search" className="mb-2 block font-semibold">
            Search dishes
          </label>
          <input
            id="search"
            type="search"
            value={term}
            onChange={(event) => changeSearch(event.target.value)}
            placeholder="Try tibs, kitfo, coffee..."
            className="w-full rounded-xl border bg-white px-4 py-3 outline-none ring-purple-200 focus:ring-4"
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-2 block font-semibold">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => changeCategory(event.target.value)}
            className="w-full rounded-xl border bg-white px-4 py-3 outline-none"
          >
            <option value="">All categories</option>
            <option value="Tibs">Tibs</option>
            <option value="Traditional">Traditional</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Pasta">Pasta</option>
            <option value="Burger">Burger</option>
            <option value="Pizza">Pizza</option>
            <option value="Drinks">Drinks</option>
          </select>
        </div>
      </div>

      <div className="mb-4 flex min-h-6 items-center justify-between text-sm text-gray-500">
        <span>
          {data
            ? `${data.total} result${data.total === 1 ? "" : "s"}`
            : "Loading results..."}
        </span>
        {isValidating && <span className="text-purple-700">Updating…</span>}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Could not load dishes. Please try again.
        </div>
      )}

      {isLoading && !data && (
        <div className="rounded-xl border bg-white p-8 text-center">
          Loading menu…
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-600">
          No dishes found for this search.
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.data.map((dish) => (
              <article
                key={dish.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                    {dish.category}
                  </span>
                  <span className="font-bold">{dish.price} ETB</span>
                </div>
                <h2 className="text-lg font-bold">{dish.name}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {dish.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between rounded-xl border bg-white p-4">
            <button
              type="button"
              onClick={() => {
                const nextPage = Math.max(1, page - 1);
                setPage(nextPage);
                updateUrl(term, category, nextPage);
              }}
              disabled={page <= 1}
              className="rounded-lg border px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <span className="text-sm font-semibold">
              Page {data.page} of {data.totalPages}
            </span>

            <button
              type="button"
              onClick={() => {
                const nextPage = Math.min(data.totalPages, page + 1);
                setPage(nextPage);
                updateUrl(term, category, nextPage);
              }}
              disabled={page >= data.totalPages}
              className="rounded-lg border px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </section>
  );
}
