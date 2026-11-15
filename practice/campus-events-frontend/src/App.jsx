import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

const emptyEvent = {
  title: "",
  description: "",
  location: "",
  eventDate: "",
  category: "technology",
  isPublished: false,
};

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [publication, setPublication] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyEvent);
  const [saving, setSaving] = useState(false);

  async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed: ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      const data = await request("/events?limit=100");
      setEvents(data.items || []);
    } catch (err) {
      setError(
        "Unable to load events. Check that your NestJS backend is running on port 3000.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function openEvent(event) {
    setSelectedEvent(event);
    setSessions([]);

    try {
      const data = await request(
        `/events/${encodeURIComponent(event.id)}/sessions`,
      );
      setSessions(Array.isArray(data) ? data : []);
    } catch {
      setSessions([]);
      setError("Could not load event sessions.");
    }
  }

  function closeDetails() {
    setSelectedEvent(null);
    setSessions([]);
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyEvent);
    setShowForm(true);
    closeDetails();
    setNotice("");
  }

  function startEdit(event) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      location: event.location,
      eventDate: event.eventDate.slice(0, 16),
      category: event.category,
      isPublished: event.isPublished,
    });
    setShowForm(true);
    closeDetails();
  }

  function updateForm(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function saveEvent(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        ...form,
        eventDate: new Date(form.eventDate).toISOString(),
      };

      if (editingId) {
        await request(`/events/${encodeURIComponent(editingId)}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setNotice("Event updated successfully.");
      } else {
        await request("/events", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setNotice("Event created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyEvent);
      await loadEvents();
    } catch (err) {
      setError(`Could not save event: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(event) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`,
    );

    if (!confirmed) return;

    try {
      await request(`/events/${encodeURIComponent(event.id)}`, {
        method: "DELETE",
      });

      setNotice("Event deleted successfully.");
      closeDetails();
      await loadEvents();
    } catch (err) {
      setError(`Could not delete event: ${err.message}`);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const searchMatch = [event.title, event.description, event.location]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const categoryMatch = category === "all" || event.category === category;

      const publicationMatch =
        publication === "all" ||
        (publication === "published" && event.isPublished) ||
        (publication === "unpublished" && !event.isPublished);

      return searchMatch && categoryMatch && publicationMatch;
    });
  }, [events, search, category, publication]);

  const publishedCount = events.filter((e) => e.isPublished).length;
  const unpublishedCount = events.length - publishedCount;

  const categories = ["technology", "business", "sports", "science", "culture"];

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#" onClick={closeDetails}>
          <span className="brand-icon">CE</span>
          <span>
            <strong>Campus Events</strong>
            <small>Management System</small>
          </span>
        </a>

        <nav className="navigation">
          <button onClick={closeDetails}>Dashboard</button>
          <button onClick={startCreate} className="nav-create">
            + Create Event
          </button>
        </nav>
      </header>

      <main className="container">
        <section className="welcome">
          <div>
            <p className="eyebrow">CAMPUS EVENT MANAGEMENT</p>
            <h1>Discover and manage campus events.</h1>
            <p className="welcome-text">
              Manage conferences, workshops, sports, science exhibitions, and
              cultural activities in one place.
            </p>
          </div>
          <button className="primary-button" onClick={startCreate}>
            + Add New Event
          </button>
        </section>

        {notice && <div className="notice success">{notice}</div>}

        {error && (
          <div className="notice error">
            {error}
            <button onClick={() => setError("")}>Dismiss</button>
          </div>
        )}

        <section className="statistics">
          <StatCard label="Total Events" value={events.length} icon="â–¦" />
          <StatCard label="Published Events" value={publishedCount} icon="âœ“" />
          <StatCard
            label="Unpublished Events"
            value={unpublishedCount}
            icon="â—·"
          />
        </section>

        {showForm && (
          <section className="panel form-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">EVENT MANAGEMENT</p>
                <h2>{editingId ? "Edit Event" : "Create Event"}</h2>
              </div>
              <button
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Close
              </button>
            </div>

            <form onSubmit={saveEvent} className="event-form">
              <label>
                Event title
                <input
                  name="title"
                  value={form.title}
                  onChange={updateForm}
                  required
                  maxLength={150}
                  placeholder="Technology Conference"
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                  required
                  rows="4"
                  placeholder="Describe the event..."
                />
              </label>

              <div className="form-grid">
                <label>
                  Location
                  <input
                    name="location"
                    value={form.location}
                    onChange={updateForm}
                    required
                    placeholder="Main Hall"
                  />
                </label>

                <label>
                  Event date and time
                  <input
                    type="datetime-local"
                    name="eventDate"
                    value={form.eventDate}
                    onChange={updateForm}
                    required
                  />
                </label>

                <label>
                  Category
                  <select
                    name="category"
                    value={form.category}
                    onChange={updateForm}
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={updateForm}
                />
                Publish this event
              </label>

              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Event"
                    : "Create Event"}
              </button>
            </form>
          </section>
        )}

        {selectedEvent && (
          <section className="panel details-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">EVENT DETAILS</p>
                <h2>{selectedEvent.title}</h2>
              </div>
              <button className="secondary-button" onClick={closeDetails}>
                Back to events
              </button>
            </div>

            <div className="details-content">
              <p>{selectedEvent.description}</p>
              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedEvent.eventDate).toLocaleString()}
              </p>
              <p>
                <strong>Category:</strong> {selectedEvent.category}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedEvent.isPublished ? "Published" : "Unpublished"}
              </p>
            </div>

            <h3>Event Sessions</h3>
            {sessions.length === 0 ? (
              <p className="muted">No sessions available for this event.</p>
            ) : (
              <div className="session-list">
                {sessions.map((session) => (
                  <article className="session-item" key={session.id}>
                    <strong>{session.title}</strong>
                    <span>{session.room}</span>
                    <small>
                      {new Date(session.startsAt).toLocaleTimeString()} â€“{" "}
                      {new Date(session.endsAt).toLocaleTimeString()}
                    </small>
                  </article>
                ))}
              </div>
            )}

            <div className="action-row">
              <button
                className="secondary-button"
                onClick={() => startEdit(selectedEvent)}
              >
                Edit Event
              </button>
              <button
                className="danger-button"
                onClick={() => deleteEvent(selectedEvent)}
              >
                Delete Event
              </button>
            </div>
          </section>
        )}

        <section className="panel events-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CAMPUS ACTIVITIES</p>
              <h2>All Events</h2>
            </div>
            <span className="result-count">
              {filteredEvents.length} results
            </span>
          </div>

          <div className="filters">
            <input
              className="search-input"
              placeholder="Search events or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={publication}
              onChange={(e) => setPublication(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>

          {loading ? (
            <div className="empty-state">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="empty-state">
              No events found. Try changing your filters.
            </div>
          ) : (
            <div className="event-grid">
              {filteredEvents.map((event) => (
                <article className="event-card" key={event.id}>
                  <div className="card-top">
                    <span className="category-tag">{event.category}</span>
                    <span
                      className={
                        event.isPublished
                          ? "status published"
                          : "status unpublished"
                      }
                    >
                      {event.isPublished ? "Published" : "Unpublished"}
                    </span>
                  </div>

                  <h3>{event.title}</h3>
                  <p className="event-description">{event.description}</p>

                  <div className="event-meta">
                    <span>âŒ– {event.location}</span>
                    <span>
                      â—· {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    className="view-button"
                    onClick={() => openEvent(event)}
                  >
                    View details â†’
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <strong>Campus Events Management System</strong>
        <p>Powered by React, NestJS and JSON file storage.</p>
      </footer>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <article className="stat-card">
      <span className="stat-icon">{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default App;

