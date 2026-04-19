"use client";

import StarRating from "@/components/StarRating";
import TableLoader from "@/components/TableLoader";
import type { Song } from "@/types/song";

type Order = "asc" | "desc";

interface Column {
  key: keyof Song;
  label: string;
}

const COLUMNS: Column[] = [
  { key: "index", label: "Index" },
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "danceability", label: "Danceability" },
  { key: "energy", label: "Energy" },
  { key: "key", label: "Key" },
  { key: "loudness", label: "Loudness" },
  { key: "mode", label: "Mode" },
  { key: "acousticness", label: "Acousticness" },
  { key: "instrumentalness", label: "Instrumentalness" },
  { key: "liveness", label: "Liveness" },
  { key: "valence", label: "Valence" },
  { key: "tempo", label: "Tempo" },
  { key: "duration_ms", label: "Duration (ms)" },
  { key: "time_signature", label: "Time Sig." },
  { key: "num_bars", label: "Bars" },
  { key: "num_sections", label: "Sections" },
  { key: "num_segments", label: "Segments" },
  { key: "song_class", label: "Class" },
  { key: "rating", label: "Rating" },
];

interface Props {
  songs: Song[];
  total: number;
  page: number;
  pageSize: number;
  sortBy: string;
  order: Order;
  loading: boolean;
  onPageChange: (page: number) => void;
  onSort: (column: string) => void;
  onRatingChange: (index: number, rating: number) => void;
}

function formatCell(value: Song[keyof Song]): string {
  if (typeof value === "number" && !Number.isInteger(value)) {
    return (value as number).toFixed(3);
  }
  return String(value);
}

function SortIcon({ column, sortBy, order }: { column: string; sortBy: string; order: Order }) {
  if (sortBy !== column) return <span className="text-gray-300 ml-1">↕</span>;
  return (
    <span className="text-blue-600 ml-1">{order === "asc" ? "↑" : "↓"}</span>
  );
}

export default function SongsTable({
  songs,
  total,
  page,
  pageSize,
  sortBy,
  order,
  loading,
  onPageChange,
  onSort,
  onRatingChange,
}: Props) {
  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return <TableLoader />;
  }

  if (songs.length === 0) {
    return (
      <div className="border rounded p-6 text-center">
        <p className="text-gray-500 text-sm">
          No matches for the current filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              {COLUMNS.slice(0, -1).map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className="border-b px-3 py-2 cursor-pointer hover:bg-gray-200 whitespace-nowrap select-none"
                >
                  {col.label}
                  <SortIcon column={col.key} sortBy={sortBy} order={order} />
                </th>
              ))}
              <th className="border-b px-3 py-2 whitespace-nowrap">Rating</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.index} className="hover:bg-gray-50">
                {COLUMNS.slice(0, -1).map((col) => (
                  <td key={col.key} className="border-b px-3 py-2 whitespace-nowrap">
                    {formatCell(song[col.key])}
                  </td>
                ))}
                <td className="border-b px-3 py-2">
                  <StarRating
                    value={song.rating}
                    onChange={(r) => onRatingChange(song.index, r)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-4 mt-3 text-sm">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
        >
          ← Previous
        </button>
        <span className="text-gray-600">
          Page {page} of {totalPages} &mdash; {total} songs total
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
