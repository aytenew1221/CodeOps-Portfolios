"use client";

import { useState } from "react";

export default function SearchBox({ onSearch }) {
  const [search, setSearch] = useState("");

  function handleChange(event) {
    const value = event.target.value;
    setSearch(value);

    if (onSearch) {
      onSearch(value);
    }
  }

  return (
    <div className="mb-6">
      <input
        type="text"
        value={search}
        onChange={handleChange}
        placeholder="Search for Ethiopian dishes..."
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      />
    </div>
  );
}
