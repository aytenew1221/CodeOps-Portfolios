"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/services/eventService";
import type { CampusEvent, PaginatedEvents } from "@/types/event";

const PAGE_SIZE = 6;

const emptyResult: PaginatedEvents = {
  items: [],
  total: 0,
  page: 1,
  limit: PAGE_SIZE,
  totalPages: 1,
};

export default function EventsPage() {
  const [result, setResult] = useState<PaginatedEvents>(emptyResult);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState<"eventDate" | "title">("eventDate");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const data = await getEvents({
          category: category || undefined,
          location: location.trim() || undefined,
          isPublished: status || undefined,
          sortBy,
          order,
          page: search.trim() ? 1 : page,
          limit: search.trim() ? 100 : PAGE_SIZE,
        });

        if (active) {
          setResult(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load campus events.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      active = false;
    };
  }, [category, location, status, sortBy, order, page, search]);

  const matchingEvents: CampusEvent[] = result.items.filter((event) =>
    event.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const totalPages = search.trim()
    ? Math.max(1, Math.ceil(matchingEvents.length / PAGE_SIZE))
    : Math.max(1, result.totalPages);

  const visibleEvents = search.trim()
    ? matchingEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : matchingEvents;

  function resetFilters() {
    setSearch("");
    setCategory("");
    setLocation("");
    setStatus("");
    setSortBy("eventDate");
    setOrder("asc");
    setPage(1);
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-blue-950 to-blue-700 px-5 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
            Explore campus life
          </p>
          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
            All Campus Events
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-blue-100">
            Discover workshops, technology conferences, sports activities,
            cultural celebrations, and other campus events.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Find an Event
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Search by title or narrow the list using the available filters.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
          }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="event-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search by title
              </label>
              <input
                id="event-search"
                type="search"
                placeholder="Search events..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              >
                <option value="">All categories</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="sports">Sports</option>
                <option value="culture">Culture</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="Enter event location"
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Publication status
              </label>
              <select
                id="status"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              >
                <option value="">All statuses</option>
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sort"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Sort by
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value as "eventDate" | "title");
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              >
                <option value="eventDate">Event date</option>
                <option value="title">Event title</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="order"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Sort order
              </label>
              <select
                id="order"
                value={order}
                onChange={(event) => {
                  setOrder(event.target.value as "asc" | "desc");
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Filters are applied to the events returned by the API.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Clear Filters
            </button>
          </div>
        </form>

        <div className="mb-6 mt-10 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Browse Events
          </h2>
          {!loading && !error && (
            <p className="text-sm text-slate-500">
              {search.trim()
                ? `${matchingEvents.length} matching events`
                : `${result.total} events found`}
            </p>
          )}
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="font-semibold text-slate-700">Loading events...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <h3 className="font-bold text-red-800">Unable to load events</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <p className="mt-3 text-sm text-slate-600">
              Check that the backend is running on port 3001.
            </p>
          </div>
        )}

        {!loading && !error && visibleEvents.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <div className="text-5xl"></div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No events found
            </h3>
            <p className="mt-2 text-slate-600">
              Try changing your search or filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && visibleEvents.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm font-semibold text-slate-600">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
