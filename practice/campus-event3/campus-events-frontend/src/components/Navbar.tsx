"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getStoredUser,
  logoutUser,
  type AuthUser,
} from "@/services/authService";

export default function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  function handleLogout() {
    logoutUser();
    setUser(null);
    window.location.assign("/");
  }

  const canManageEvents = user?.role === "ADMIN" || user?.role === "STAFF";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
        >
          <span className="text-green-700">Campus</span>
          <span className="text-red-600">Events</span>
        </Link>

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

          {canManageEvents && (
            <>
              <Link
                href="/create-event"
                className="rounded-lg bg-green-700 px-4 py-2.5 text-white transition hover:bg-green-800"
              >
                Create Event
              </Link>

              <Link
                href="/admin/events"
                className="rounded-lg border border-green-700 px-4 py-2.5 text-green-700 transition hover:bg-green-50"
              >
                Manage Events
              </Link>
            </>
          )}

          {user ? (
            <>
              <span className="text-slate-600">
                {user.name} ({user.role})
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-600 px-4 py-2 text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-green-700 px-4 py-2 text-green-700 transition hover:bg-green-50"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-green-700 px-4 py-2 text-white transition hover:bg-green-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>
    </header>
  );
}
