"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import EventCard from "@/components/EventCard";
import { getEventById, getEventSessions } from "@/services/eventService";
import type { CampusEvent, CampusSession } from "@/types/event";

function EventDetailsContent() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;

  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [sessions, setSessions] = useState<CampusSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEventDetails() {
      setLoading(true);
      setError("");
      setSessionError("");

      try {
        const eventData = await getEventById(eventId);

        if (!active) return;

        setEvent(eventData);

        try {
          const sessionData = await getEventSessions(eventId);

          if (active) {
            setSessions(sessionData);
          }
        } catch (err) {
          if (active) {
            setSessionError(
              err instanceof Error
                ? err.message
                : "Unable to load event sessions.",
            );
          }
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Unable to find this event.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (eventId) {
      loadEventDetails();
    }

    return () => {
      active = false;
    };
  }, [eventId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-20 text-center">
        <p className="font-semibold text-slate-600">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <div className="text-5xl"></div>
        <h1 className="mt-5 text-3xl font-extrabold text-slate-900">
          Event Not Found
        </h1>
        <p className="mt-3 text-slate-600">
          {error || "The requested event could not be found."}
        </p>
        <Link
          href="/events"
          className="mt-7 inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Back to All Events
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.eventDate).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-blue-950 to-blue-700 px-5 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/events"
            className="text-sm font-semibold text-blue-200 hover:text-white"
          >
            Back to All Events
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold capitalize">
              {event.category}
            </span>
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              {event.isPublished ? "Published" : "Draft"}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold md:text-5xl">
            {event.title}
          </h1>

          <p className="mt-5 max-w-3xl leading-8 text-blue-100">
            {event.description}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Event Information
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Event date and time
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {formattedDate}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">Location</p>
                <p className="mt-2 font-semibold text-slate-900">
                  {event.location}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">Category</p>
                <p className="mt-2 font-semibold capitalize text-slate-900">
                  {event.category}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Publication status
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {event.isPublished ? "Published" : "Draft"}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-slate-900">
                About This Event
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                {event.description}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Event Sessions
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Explore the sessions scheduled for this event.
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                {sessions.length} sessions
              </span>
            </div>

            {sessionError && (
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                Unable to load sessions: {sessionError}
              </div>
            )}

            {!sessionError && sessions.length === 0 && (
              <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center">
                <div className="text-4xl"></div>
                <p className="mt-3 font-semibold text-slate-800">
                  No sessions available
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Sessions for this event have not been added yet.
                </p>
              </div>
            )}

            {sessions.length > 0 && (
              <div className="mt-6 space-y-4">
                {sessions.map((session) => (
                  <article
                    key={session.id}
                    className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-300"
                  >
                    <h3 className="text-lg font-bold text-slate-900">
                      {session.title}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <p>
                        Starts:{" "}
                        {session.startsAt
                          ? new Date(session.startsAt).toLocaleString()
                          : "Not specified"}
                      </p>
                      <p>
                        Ends:{" "}
                        {session.endsAt
                          ? new Date(session.endsAt).toLocaleString()
                          : "Not specified"}
                      </p>
                      <p>Room: {session.room || "Not specified"}</p>
                    </div>

                    <Link
                      href={`/events/${encodeURIComponent(event.id)}/sessions/${encodeURIComponent(session.id)}`}
                      className="mt-4 inline-block text-sm font-bold text-blue-700 hover:text-blue-900"
                    >
                      View Session Details â†’
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">
            Event Summary
          </h2>

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-slate-500">Event</p>
              <p className="mt-1 font-semibold text-slate-900">{event.title}</p>
            </div>
            <div>
              <p className="text-slate-500">Location</p>
              <p className="mt-1 font-semibold text-slate-900">
                {event.location}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Sessions</p>
              <p className="mt-1 font-semibold text-slate-900">
                {sessions.length}
              </p>
            </div>
          </div>

          <Link
            href="/events"
            className="mt-7 block rounded-lg border border-blue-700 px-4 py-3 text-center font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Browse More Events
          </Link>
        </aside>
      </section>
    </div>
  );
}

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-5xl px-5 py-16 text-center">
          Loading event details...
        </main>
      }
    >
      <EventDetailsContent />
    </Suspense>
  );
}

