import { getAuthToken } from "@/services/authService";
import type {
  CampusEvent,
  CampusSession,
  CreateEventInput,
  EventFilters,
  PaginatedEvents,
} from "@/types/event";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
).replace(/\/$/, "");

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      cache: "no-store",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(getAuthToken()
          ? { Authorization: `Bearer ${getAuthToken()}` }
          : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot connect to the Campus Events API. Make sure the backend is running.",
    );
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `API request failed with status ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function normalizeEvents(data: unknown): PaginatedEvents {
  if (Array.isArray(data)) {
    const items = data as CampusEvent[];
    return {
      items,
      total: items.length,
      page: 1,
      limit: items.length || 10,
      totalPages: 1,
    };
  }

  if (!data || typeof data !== "object") {
    throw new Error("The API returned an unexpected events response.");
  }

  const result = data as Record<string, unknown>;
  const items = result.items ?? result.data ?? result.events;

  if (!Array.isArray(items)) {
    throw new Error("The API response does not contain an events list.");
  }

  return {
    items: items as CampusEvent[],
    total: Number(result.total ?? items.length),
    page: Number(result.page ?? 1),
    limit: Number(result.limit ?? items.length),
    totalPages: Number(result.totalPages ?? 1),
  };
}

export async function getEvents(
  filters: EventFilters = {},
): Promise<PaginatedEvents> {
  const params = new URLSearchParams();

  if (filters.category) params.set("category", filters.category);
  if (filters.location) params.set("location", filters.location);

  if (filters.isPublished !== undefined && filters.isPublished !== "") {
    params.set("isPublished", filters.isPublished);
  }

  params.set("sortBy", filters.sortBy ?? "eventDate");
  params.set("order", filters.order ?? "asc");
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 6));

  const query = params.toString();
  const data = await apiRequest<unknown>(`/events?${query}`);

  return normalizeEvents(data);
}

export async function getUpcomingEvents(): Promise<CampusEvent[]> {
  // The existing API's upcoming route is not assumed to exist.
  // Use the existing events endpoint and filter future events here.
  const result = await getEvents({
    page: 1,
    limit: 100,
    sortBy: "eventDate",
    order: "asc",
  });

  const now = new Date();

  return result.items
    .filter(
      (event) =>
        event.isPublished &&
        new Date(event.eventDate).getTime() >= now.getTime(),
    )
    .slice(0, 6);
}

export async function getEventById(id: string): Promise<CampusEvent> {
  return apiRequest<CampusEvent>(`/events/${encodeURIComponent(id)}`);
}

export async function getEventSessions(
  eventId: string,
): Promise<CampusSession[]> {
  const data = await apiRequest<unknown>(
    `/events/${encodeURIComponent(eventId)}/sessions`,
  );

  if (Array.isArray(data)) return data as CampusSession[];

  if (data && typeof data === "object") {
    const result = data as Record<string, unknown>;
    const sessions = result.items ?? result.data ?? result.sessions;

    if (Array.isArray(sessions)) return sessions as CampusSession[];
  }

  return [];
}

export async function getSessionById(
  eventId: string,
  sessionId: string,
): Promise<CampusSession> {
  return apiRequest<CampusSession>(
    `/events/${encodeURIComponent(eventId)}/sessions/${encodeURIComponent(sessionId)}`,
  );
}

export async function createEvent(
  event: CreateEventInput,
): Promise<CampusEvent> {
  return apiRequest<CampusEvent>("/events", {
    method: "POST",
    body: JSON.stringify(event),
  });
}

export async function getManageEvents(
  filters: EventFilters = {},
): Promise<PaginatedEvents> {
  const params = new URLSearchParams();

  params.set("sortBy", filters.sortBy ?? "eventDate");
  params.set("order", filters.order ?? "asc");
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 100));

  if (filters.isPublished !== undefined && filters.isPublished !== "") {
    params.set("isPublished", filters.isPublished);
  }

  const data = await apiRequest<unknown>(`/events/manage?${params.toString()}`);

  return normalizeEvents(data);
}

export async function deleteEvent(id: string): Promise<CampusEvent> {
  return apiRequest<CampusEvent>(`/events/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function updateEvent(
  id: string,
  event: Partial<CreateEventInput>,
): Promise<CampusEvent> {
  return apiRequest<CampusEvent>(`/events/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(event),
  });
}


// Session management types and API functions.
export type CreateSessionInput = Omit<CampusSession, "id" | "eventId">;
export type UpdateSessionInput = Partial<CreateSessionInput>;

// STAFF and ADMIN can retrieve sessions for draft or published events.
export async function getManageEventSessions(
  eventId: string,
): Promise<CampusSession[]> {
  const data = await apiRequest<unknown>(
    `/events/manage/${encodeURIComponent(eventId)}/sessions`,
  );

  if (Array.isArray(data)) return data as CampusSession[];

  if (data && typeof data === "object") {
    const result = data as Record<string, unknown>;
    const sessions = result.items ?? result.data ?? result.sessions;

    if (Array.isArray(sessions)) return sessions as CampusSession[];
  }

  return [];
}

export async function createSession(
  eventId: string,
  session: CreateSessionInput,
): Promise<CampusSession> {
  return apiRequest<CampusSession>(
    `/events/${encodeURIComponent(eventId)}/sessions`,
    {
      method: "POST",
      body: JSON.stringify(session),
    },
  );
}

export async function updateSession(
  eventId: string,
  sessionId: string,
  session: UpdateSessionInput,
): Promise<CampusSession> {
  return apiRequest<CampusSession>(
    `/events/${encodeURIComponent(eventId)}/sessions/${encodeURIComponent(sessionId)}`,
    {
      method: "PUT",
      body: JSON.stringify(session),
    },
  );
}

export async function deleteSession(
  eventId: string,
  sessionId: string,
): Promise<CampusSession> {
  return apiRequest<CampusSession>(
    `/events/${encodeURIComponent(eventId)}/sessions/${encodeURIComponent(sessionId)}`,
    {
      method: "DELETE",
    },
  );
}

// ADMIN-only publication workflow
export async function publishEvent(id: string): Promise<CampusEvent> {
  return apiRequest<CampusEvent>(
    `/events/${encodeURIComponent(id)}/publish`,
    { method: "PATCH" },
  );
}

export async function unpublishEvent(id: string): Promise<CampusEvent> {
  return apiRequest<CampusEvent>(
    `/events/${encodeURIComponent(id)}/unpublish`,
    { method: "PATCH" },
  );
}
