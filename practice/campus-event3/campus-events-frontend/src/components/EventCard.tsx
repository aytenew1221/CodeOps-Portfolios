import Link from "next/link";
import type { CampusEvent } from "@/types/event";

interface EventCardProps {
  event: CampusEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.eventDate).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold capitalize text-blue-700">
          {event.category}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            event.isPublished
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {event.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      <h2 className="mb-3 text-xl font-bold text-slate-900">{event.title}</h2>

      <p className="mb-5 flex-1 text-sm leading-6 text-slate-600">
        {event.description}
      </p>

      <div className="space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
        <p>Location: {event.location}</p>
        <p>Date: {formattedDate}</p>
      </div>

      <Link
        href={`/events/${encodeURIComponent(event.id)}`}
        className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
      >
        View Details
      </Link>
    </article>
  );
}
