"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth-api";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("abebe@example.com");

  const [password, setPassword] = useState("Abebe123!");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block font-semibold">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border px-4 py-3"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block font-semibold">
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border px-4 py-3"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-purple-700 px-5 py-3 font-bold text-white hover:bg-purple-800 disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <div className="rounded-xl bg-gray-50 p-4 text-sm">
        <p className="font-semibold">Demo accounts</p>

        <p className="mt-2">
          Customer:
          <br />
          abebe@example.com
          <br />
          Abebe123!
        </p>

        <p className="mt-3">
          Staff:
          <br />
          staff@addiseats.com
          <br />
          Staff123!
        </p>
      </div>
    </form>
  );
}
