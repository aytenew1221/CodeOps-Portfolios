"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function PaginatedMenu() {
  const page = 1;
  const { data, error, isLoading } = useSWR(
    `/api/dishes?page=${page}&limit=4`,
    fetcher,
    { keepPreviousData: true },
  );

  if (error) return <p>Could not load the menu.</p>;
  if (isLoading && !data) return <p>Loading menu...</p>;

  return (
    <div>
      {data?.data?.map((dish) => (
        <div key={dish.id}>{dish.name}</div>
      ))}
    </div>
  );
}
