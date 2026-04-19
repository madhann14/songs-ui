import type { PaginatedSongsResponse, Song } from "@/types/song";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getSongs(
  page = 1,
  pageSize = 10,
  search_query = "",
  sortBy = "index",
  order: "asc" | "desc" = "asc"
): Promise<PaginatedSongsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    search_query,
    sort_by: sortBy,
    order,
  });
  const res = await fetch(`${BASE_URL}/songs?${params}`);
  if (!res.ok) throw new Error(`Failed to fetch songs: ${res.status}`);
  return res.json();
}

export async function updateRating(
  index: number,
  rating: number
): Promise<Song> {
  const res = await fetch(`${BASE_URL}/songs/${index}/rating`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating }),
  });
  if (!res.ok) throw new Error(`Failed to update rating: ${res.status}`);
  return res.json();
}
