"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Song } from "@/types/song";

interface Props {
  songs: Song[];
  /** Number of songs to show per chart (keeps bars readable). */
  limit?: number;
}

/**
 * Two side-by-side bar charts:
 *  - Acousticness per song (0–1 scale)
 *  - Tempo per song (BPM)
 *
 * Limited to the first `limit` songs to keep the charts readable.
 */
export default function AcousticTempoBar({ songs, limit = 30 }: Props) {
  if (!songs.length) return null;

  const data = songs.slice(0, limit).map((s) => ({
    title: s.title.length > 12 ? s.title.slice(0, 12) + "…" : s.title,
    acousticness: s.acousticness,
    tempo: Math.round(s.tempo),
  }));

  const sharedAxis = {
    angle: -45,
    textAnchor: "end" as const,
    interval: 0,
    tick: { fontSize: 9 },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Acousticness */}
      <div>
        <h2 className="text-base font-semibold mb-2">
          Acousticness (first {Math.min(limit, songs.length)} songs)
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 70, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" {...sharedAxis} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [v.toFixed(3), "Acousticness"]} />
            <Bar dataKey="acousticness" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tempo */}
      <div>
        <h2 className="text-base font-semibold mb-2">
          Tempo (first {Math.min(limit, songs.length)} songs)
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 70, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" {...sharedAxis} />
            <YAxis unit=" BPM" tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [`${v} BPM`, "Tempo"]} />
            <Bar dataKey="tempo" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
