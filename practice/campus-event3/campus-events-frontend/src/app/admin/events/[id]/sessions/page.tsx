"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  createSession,
  deleteSession,
  getManageEventSessions,
  getManageEvents,
  updateSession,
} from "@/services/eventService";

import { getStoredUser, type AuthUser } from "@/services/authService";
import type { CampusEvent, CampusSession } from "@/types/event";

type SessionForm = {
  title: string;
  startsAt: string;
  endsAt: string;
  room: string;
};

const emptyForm: SessionForm = {
  title: "",
  startsAt: "",
  endsAt: "",
  room: "",
};

function toDateTimeLocal(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function toISOString(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Please enter valid session dates and times.");
  }

  return date.toISOString();
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function SessionManagementContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = params.id;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [sessions, setSessions] = useState<CampusSession[]>([]);
  const [form, setForm] = useState<SessionForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      setError("");

      const [eventResult, sessionResult] = await Promise.all([
        getManageEvents({
          page: 1,
          limit: 100,
          sortBy: "eventDate",
          order: "asc",
        }),
        getManageEventSessions(eventId),
      ]);

      const selectedEvent = eventResult.items.find(
        (item) => item.id === eventId,
      );

      if (!selectedEvent) {
        throw new Error(
          "Event not found in the management list. Check that the event exists and is accessible.",
        );
      }

      setEvent(selectedEvent);
      setSessions(sessionResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load event sessions.",
      );
    } finally {
      setLoading(false);
    }
  }, [eventId]);

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
  }, [router]);

  useEffect(() => {
    if (user && eventId) {
      void loadData();
    }
  }, [user, eventId, loadData]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  }

  function startEditing(session: CampusSession) {
    setEditingId(session.id);
    setForm({
      title: session.title,
      startsAt: toDateTimeLocal(session.startsAt),
      endsAt: toDateTimeLocal(session.endsAt),
      room: session.room,
    });
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(eventObject: React.FormEvent<HTMLFormElement>) {
    eventObject.preventDefault();

    if (!eventId || !form.title.trim() || !form.room.trim()) {
      setError("Please complete all session fields.");
      return;
    }

    if (!form.startsAt || !form.endsAt) {
      setError("Please enter both the start and end date and time.");
      return;
    }

    const startTime = new Date(form.startsAt).getTime();
    const endTime = new Date(form.endsAt).getTime();

    if (
      Number.isNaN(startTime) ||
      Number.isNaN(endTime) ||
      endTime <= startTime
    ) {
      setError("The session end time must be later than its start time.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      startsAt: toISOString(form.startsAt),
      endsAt: toISOString(form.endsAt),
      room: form.room.trim(),
    };

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateSession(eventId, editingId, payload);
        setSuccess("Session updated successfully.");
      } else {
        await createSession(eventId, payload);
        setSuccess("Session created successfully.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save the session.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(session: CampusSession) {
    if (!eventId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete the session "${session.title}"?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(session.id);
      setError("");
      setSuccess("");

      await deleteSession(eventId, session.id);

      setSessions((previous) =>
        previous.filter((item) => item.id !== session.id),
      );

      if (editingId === session.id) {
        resetForm();
      }

      setSuccess("Session deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete the session.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (!user || loading) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16 text-center">
        <p className="font-semibold text-slate-600">
          {user ? "Loading session management..." : "Checking permissions..."}
        </p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-bold text-red-800">
            Unable to open session management
          </h1>
          <p className="mt-3 text-red-700">
            {error || "The requested event could not be loaded."}
          </p>
          <Link
            href="/admin/events"
            className="mt-5 inline-block font-semibold text-blue-700 hover:underline"
          >
            Back to Event Management
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8">
        <Link
          href="/admin/events"
          className="text-sm font-semibold text-blue-700 hover:underline"
        >
          &larr; Back to Event Management
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
            {user.role}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              event.isPublished
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {event.isPublished ? "Published" : "Draft"}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
          Session Management
        </h1>

        <p className="mt-2 text-slate-600">
          Manage the sessions for <strong>{event.title}</strong>.
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {event.location} · {formatDate(event.eventDate)}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {success}
        </div>
      )}

      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          {editingId ? "Edit Session" : "Add a New Session"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="session-title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Session Title
            </label>
            <input
              id="session-title"
              type="text"
              required
              maxLength={150}
              value={form.title}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  title: e.target.value,
                }))
              }
              placeholder="e.g. Opening Keynote"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="session-start"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Start Date and Time
              </label>
              <input
                id="session-start"
                type="datetime-local"
                required
                value={form.startsAt}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    startsAt: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="session-end"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                End Date and Time
              </label>
              <input
                id="session-end"
                type="datetime-local"
                required
                value={form.endsAt}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    endsAt: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="session-room"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Room / Venue
            </label>
            <input
              id="session-room"
              type="text"
              required
              maxLength={100}
              value={form.room}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  room: e.target.value,
                }))
              }
              placeholder="e.g. Main Auditorium"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Session"
                  : "Create Session"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Existing Sessions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {sessions.length} session{sessions.length === 1 ? "" : "s"}{" "}
              scheduled
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Refresh Sessions
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <h3 className="text-lg font-bold text-slate-800">
              No sessions yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Use the form above to create the first session for this event.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <article
                key={session.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {session.title}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <p>
                        <strong>Starts:</strong>{" "}
                        {formatDate(session.startsAt)}
                      </p>
                      <p>
                        <strong>Ends:</strong> {formatDate(session.endsAt)}
                      </p>
                      <p>
                        <strong>Room:</strong> {session.room}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(session)}
                      className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(session)}
                      disabled={deletingId === session.id}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingId === session.id ? "Deleting..." : "Delete"}
                    </button>

                    <Link
                      href={`/events/${encodeURIComponent(event.id)}/sessions/${encodeURIComponent(session.id)}`}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function SessionManagementPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-5 py-16 text-center">
          Loading session management...
        </main>
      }
    >
      <SessionManagementContent />
    </Suspense>
  );
}
