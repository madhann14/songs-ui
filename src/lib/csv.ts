import type { Song } from "@/types/song";

const COLUMNS: (keyof Song)[] = [
  "index",
  "id",
  "title",
  "danceability",
  "energy",
  "key",
  "loudness",
  "mode",
  "acousticness",
  "instrumentalness",
  "liveness",
  "valence",
  "tempo",
  "duration_ms",
  "time_signature",
  "num_bars",
  "num_sections",
  "num_segments",
  "song_class",
  "rating",
];

/** Converts an array of songs to a CSV string. */
export function songsToCSV(songs: Song[]): string {
  const header = COLUMNS.join(",");
  const rows = songs.map((song) =>
    COLUMNS.map((col) => {
      const val = String(song[col]);
      // Wrap in quotes if the value contains a comma or quote
      return val.includes(",") || val.includes('"')
        ? `"${val.replace(/"/g, '""')}"`
        : val;
    }).join(",")
  );
  return [header, ...rows].join("\n");
}

/** Triggers a CSV file download in the browser. */
export function downloadCSV(songs: Song[], filename = "songs.csv"): void {
  const csv = songsToCSV(songs);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
