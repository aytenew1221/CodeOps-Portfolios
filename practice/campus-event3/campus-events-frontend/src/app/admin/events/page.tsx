"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteEvent, getManageEvents, publishEvent, unpublishEvent } from "@/services/eventService";
import { getStoredUser, type AuthUser } from "@/services/authService";
import type { CampusEvent } from "@/types/event";

type StatusFilter = "all" | "published" | "draft";

export default function AdminEventsPage() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getManageEvents({
        page: 1,
        limit: 100,
        sortBy: "eventDate",
        order: "asc",
      });

      setEvents(result.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load managed events.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentUser = getStoredUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "ADMIN" && currentUser.role !== "STAFF") {
      router.replace("/");
      return;
    }

    setUser(currentUser);
    void loadEvents();
  }, [router, loadEvents]);

  const filteredEvents = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !searchTerm ||
        [event.title, event.description, event.location, event.category].some(
          (value) => value.toLowerCase().includes(searchTerm),
        );

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && event.isPublished) ||
        (statusFilter === "draft" && !event.isPublished);

      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  async function handlePublicationToggle(event: CampusEvent) {
    if (user?.role !== "ADMIN") {
      setError("Only administrators can publish or unpublish events.");
      return;
    }

    try {
      setPublishingId(event.id);
      setError("");

      const updatedEvent = event.isPublished
        ? await unpublishEvent(event.id)
        : await publishEvent(event.id);

      setEvents((previous) =>
        previous.map((item) => item.id === event.id ? updatedEvent : item),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update publication status.");
    } finally {
      setPublishingId(null);
    }
  }

  async function handleDelete(event: CampusEvent) {
    if (user?.role !== "ADMIN") {
      setError("Only administrators can delete events.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"? This also deletes its associated sessions.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(event.id);
      setError("");

      await deleteEvent(event.id);

      setEvents((previous) => previous.filter((item) => item.id !== event.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete event.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-slate-500">Checking permissions...</p>
      </main>
    );
  }

  const publishedCount = events.filter((event) => event.isPublished).length;
  const draftCount = events.length - publishedCount;

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-green-700">
            {user.role} CONTROL PANEL
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Event Management
          </h1>

          <p className="mt-2 text-slate-600">View and manage campus events.</p>
        </div>

        <Link
          href="/create-event"
          className="rounded-lg bg-green-700 px-5 py-3 text-center font-semibold text-white hover:bg-green-800"
        >
          + Create Event
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Total Events</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {events.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Published</p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {publishedCount}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Drafts</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{draftCount}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="event-search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Search Events
          </label>

          <input
            id="event-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, description, location..."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label
            htmlFor="status-filter"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Publication Status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          >
            <option value="all">All Events</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-3 sm:col-span-2">
          <p className="text-sm text-slate-500">
            Showing {filteredEvents.length} of {events.length} events
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <p className="py-10 text-center text-slate-500">Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="text-xl font-bold">No matching events</h2>
          <p className="mt-2 text-slate-500">
            Try changing your search or publication filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-5 py-4">Event</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{event.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(event.eventDate).toLocaleString()}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {event.location}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          event.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {event.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {event.isPublished && (
                        <Link
                          href={`/events/${encodeURIComponent(event.id)}`}
                          className="rounded-lg border border-blue-600 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          View
                        </Link>
                        )}

                        {user.role === "ADMIN" && (
                          <button
                            type="button"
                            onClick={() => handlePublicationToggle(event)}
                            disabled={publishingId === event.id}
                            className={`rounded-lg px-3 py-2 font-semibold text-white disabled:opacity-50 ${
                              event.isPublished
                                ? "bg-amber-600 hover:bg-amber-700"
                                : "bg-green-700 hover:bg-green-800"
                            }}`}
                          >
                            {publishingId === event.id
                              ? "Saving..."
                              : event.isPublished
                                ? "Unpublish"
                                : "Publish"}
                          </button>
                        )}

                        <Link
                          href={`/admin/events/${encodeURIComponent(event.id)}/edit`}
                          className="rounded-lg border border-green-600 px-3 py-2 font-semibold text-green-700 hover:bg-green-50"
                        >
                          Edit
                        </Link>

                        <Link
                          href={`/admin/events/${encodeURIComponent(event.id)}/sessions`}
                          className="rounded-lg border border-purple-600 px-3 py-2 font-semibold text-purple-700 hover:bg-purple-50"
                        >
                          Sessions
                        </Link>
                        {user.role === "ADMIN" && (
                          <button
                            type="button"
                            onClick={() => handleDelete(event)}
                            disabled={deletingId === event.id}
                            className="rounded-lg bg-red-600 px-3 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            {deletingId === event.id ? "Deleting..." : "Delete"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

