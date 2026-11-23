"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getStoredUser } from "@/services/authService";
import { getEventById, updateEvent } from "@/services/eventService";
import type { CreateEventInput } from "@/types/event";

function toDateTimeLocal(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 16);
}

function EditEventForm() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = params.id;

  const [form, setForm] = useState<CreateEventInput>({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    category: "technology",
  });

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      router.replace("/");
      return;
    }

    setAuthorized(true);

    async function loadEvent() {
      try {
        const event = await getEventById(eventId);

        setForm({
          title: event.title,
          description: event.description,
          location: event.location,
          eventDate: toDateTimeLocal(event.eventDate),
          category: event.category,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load this event.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      void loadEvent();
    }
  }, [eventId, router]);

  function handleChange(
    field: keyof CreateEventInput,
    value: string,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!form.eventDate) {
      setError("Please select an event date and time.");
      return;
    }

    setSaving(true);

    try {
      await updateEvent(eventId, {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        eventDate: new Date(form.eventDate).toISOString(),
      });

      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update the event.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!authorized || loading) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <p>Loading event...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Edit Event</h1>

        <Link
          href="/admin/events"
          className="rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          Back to Manage Events
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-300 bg-red-50 p-3 text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border p-6 shadow-sm"
      >
        <div>
          <label htmlFor="title" className="mb-2 block font-medium">
            Event Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block font-medium">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={5}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label htmlFor="location" className="mb-2 block font-medium">
            Location
          </label>
          <input
            id="location"
            type="text"
            required
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label htmlFor="eventDate" className="mb-2 block font-medium">
            Event Date and Time
          </label>
          <input
            id="eventDate"
            type="datetime-local"
            required
            value={form.eventDate}
            onChange={(e) => handleChange("eventDate", e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-2 block font-medium">
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="technology">Technology</option>
            <option value="business">Business</option>
            <option value="sports">Sports</option>
            <option value="culture">Culture</option>
          </select>
        </div>

        

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <Link
            href="/admin/events"
            className="rounded-lg border px-6 py-3 hover:bg-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

export default function EditEventPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl p-8">
          <p>Loading edit page...</p>
        </main>
      }
    >
      <EditEventForm />
    </Suspense>
  );
}

