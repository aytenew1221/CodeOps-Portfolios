"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getEventById,
  getSessionById,
} from "@/services/eventService";
import type { CampusEvent, CampusSession } from "@/types/event";

function SessionDetailsContent() {
  const params = useParams<{ id: string; sessionId: string }>();
  const eventId = params.id;
  const sessionId = params.sessionId;

  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [session, setSession] = useState<CampusSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDetails() {
      try {
        setLoading(true);
        setError("");

        const [eventData, sessionData] = await Promise.all([
          getEventById(eventId),
          getSessionById(eventId, sessionId),
        ]);

        if (active) {
          setEvent(eventData);
          setSession(sessionData);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load session details.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetails();

    return () => {
      active = false;
    };
  }, [eventId, sessionId]);

  if (loading) {
    return <main className="mx-auto max-w-4xl px-5 py-16 text-center">Loading session details...</main>;
  }

  if (error || !session || !event) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="text-xl font-bold">Session not available</h1>
          <p className="mt-2">{error || "The requested session could not be found."}</p>
          <Link
            href={`/events/${encodeURIComponent(eventId)}`}
            className="mt-5 inline-block font-semibold underline"
          >
            Back to event
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <Link
        href={`/events/${encodeURIComponent(event.id)}`}
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to {event.title}
      </Link>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          EVENT SESSION
        </span>

        <h1 className="mt-5 text-3xl font-extrabold text-slate-900">
          {session.title}
        </h1>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">Starts</p>
            <p className="mt-2 font-bold text-slate-900">
              {new Date(session.startsAt).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">Ends</p>
            <p className="mt-2 font-bold text-slate-900">
              {new Date(session.endsAt).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5 sm:col-span-2">
            <p className="text-sm font-semibold text-slate-500">Room</p>
            <p className="mt-2 font-bold text-slate-900">
              {session.room || "Room not specified"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">Related event</h2>
        <p className="mt-3 text-xl font-bold text-blue-700">{event.title}</p>
        <p className="mt-2 text-sm text-slate-600">{event.location}</p>
        <p className="mt-1 text-sm text-slate-600">
          {new Date(event.eventDate).toLocaleString()}
        </p>
      </section>
    </main>
  );
}

export default function SessionDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-5 py-16 text-center">
          Loading session details...
        </main>
      }
    >
      <SessionDetailsContent />
    </Suspense>
  );
}


