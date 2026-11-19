import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        {/* Campus Events Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
        >
          <span className="text-green-700">Campus</span>
          <span className="text-red-600">Events</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center gap-3 text-sm font-bold sm:gap-6">
          <Link
            href="/"
            className="text-slate-700 transition hover:text-green-700"
          >
            Home
          </Link>

          <Link
            href="/events"
            className="text-slate-700 transition hover:text-green-700"
          >
            All Events
          </Link>

          <Link
            href="/create-event"
            className="rounded-lg bg-green-700 px-4 py-2.5 text-white shadow-sm transition hover:bg-green-800"
          >
            Create Event
          </Link>
        </div>
      </nav>

      {/* Ethiopian Flag Color Stripe */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>
    </header>
  );
}
