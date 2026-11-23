"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import { getUpcomingEvents } from "@/services/eventService";
import type { CampusEvent } from "@/types/event";

export default function HomePage() {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUpcomingEvents() {
      try {
        setLoading(true);
        setError("");

        const result = await getUpcomingEvents();

        if (active) {
          setEvents(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load upcoming events.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUpcomingEvents();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-purple-50/40">
      <section className="bg-gradient-to-br from-purple-950 via-purple-800 to-violet-600 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-block rounded-full border border-purple-200/40 bg-white/10 px-4 py-2 text-sm font-semibold">
              Your campus. Your community. Your events.
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
              Discover What&apos;s Happening on Campus
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-purple-100">
              Find campus activities, attend workshops, connect with students,
              and never miss an important event in your university community.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/events"
                className="rounded-xl bg-white px-6 py-3 font-bold text-purple-800 transition hover:bg-purple-100"
              >
                Explore Events
              </Link>

              <Link
                href="/create-event"
                className="rounded-xl border border-white/60 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Create an Event
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur">

            <h2 className="mt-6 text-2xl font-bold">
              Be Part of Campus Life
            </h2>

            <p className="mt-3 leading-7 text-purple-100">
              From technology conferences and business workshops to sports
              festivals and cultural celebrations, discover opportunities to
              learn, participate, and connect.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="mt-2 text-sm font-semibold">Technology</p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="mt-2 text-sm font-semibold">Sports</p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="mt-2 text-sm font-semibold">Culture</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-purple-700">
              Stay connected
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
              Upcoming Events
            </h2>

            <p className="mt-2 text-slate-600">
              Explore the latest published campus events.
            </p>
          </div>

          <Link
            href="/events"
            className="font-bold text-purple-700 transition hover:text-purple-950"
          >
            View All Events →
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl border border-purple-100 bg-white p-12 text-center">
            <p className="font-semibold text-purple-800">
              Loading upcoming events...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h3 className="text-lg font-bold text-red-800">
              Unable to load events
            </h3>

            <p className="mt-2 text-sm text-red-700">{error}</p>

            <p className="mt-3 text-sm text-slate-600">
              Check that your backend is running on port 3000.
            </p>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="rounded-2xl border border-purple-100 bg-white p-12 text-center">

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No upcoming events yet
            </h3>

            <p className="mt-2 text-slate-600">
              Check again later or create a new campus event.
            </p>

            <Link
              href="/create-event"
              className="mt-6 inline-block rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white transition hover:bg-purple-800"
            >
              Create an Event
            </Link>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-purple-100 bg-purple-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-14 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-purple-950">
              Have an event to share?
            </h2>

            <p className="mt-2 text-purple-800">
              Create an event and let your campus community know about it.
            </p>
          </div>

          <Link
            href="/create-event"
            className="rounded-xl bg-purple-700 px-6 py-3 font-bold text-white transition hover:bg-purple-800"
          >
            Create Your Event
          </Link>
        </div>
      </section>
    </div>
  );
}

