export async function fetcher(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "Failed to fetch data");
  }

  return response.json();
}
