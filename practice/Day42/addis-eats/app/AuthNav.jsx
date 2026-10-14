"use client";

import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { logout } from "@/lib/auth-api";

export default function AuthNav() {
  const router = useRouter();

  const { data, mutate } = useSWR("/api/auth/me", fetcher);

  async function handleLogout() {
    await logout();

    await mutate();

    router.push("/");
    router.refresh();
  }

  if (!data?.authenticated) {
    return (
      <Link
        href="/login"
        className="rounded-lg bg-purple-700 px-4 py-2 text-white hover:bg-purple-800"
      >
        Sign In
      </Link>
    );
  }

  const user = data.user;

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm sm:inline">
        Hi, <strong>{user.name}</strong>
      </span>

      {user.role === "staff" && (
        <Link
          href="/staff"
          className="rounded-lg bg-orange-100 px-3 py-2 text-orange-700"
        >
          Staff
        </Link>
      )}

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border px-3 py-2 font-semibold hover:bg-gray-50"
      >
        Sign Out
      </button>
    </div>
  );
}
