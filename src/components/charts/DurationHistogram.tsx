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

interface Bin {
  range: string;
  count: number;
}

interface Props {
  songs: Song[];
  numBins?: number;
}

/** Groups song durations (in seconds) into equal-width bins for a histogram. */
export function buildHistogramBins(songs: Song[], numBins: number): Bin[] {
  if (!songs.length) return [];

  const durations = songs.map((s) => s.duration_ms / 1000);
  const min = Math.min(...durations);
  const max = Math.max(...durations);
  const binSize = (max - min) / numBins;

  const bins: Bin[] = Array.from({ length: numBins }, (_, i) => ({
    range: `${Math.round(min + i * binSize)}–${Math.round(min + (i + 1) * binSize)}s`,
    count: 0,
  }));

  durations.forEach((d) => {
    const idx = Math.min(Math.floor((d - min) / binSize), numBins - 1);
    bins[idx].count++;
  });

  return bins;
}

/**
 * Histogram of song durations.
 * Each bar represents a duration range (in seconds); height = number of songs in that range.
 */
export default function DurationHistogram({ songs, numBins = 20 }: Props) {
  if (!songs.length) return null;

  const data = buildHistogramBins(songs, numBins);

  return (
    <div>
      <h2 className="text-base font-semibold mb-2">
        Song Duration Distribution
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 50, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="range"
            angle={-30}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 10 }}
            label={{ value: "Duration (seconds)", position: "insideBottom", offset: -35 }}
          />
          <YAxis
            allowDecimals={false}
            label={{ value: "# Songs", angle: -90, position: "insideLeft", offset: 10 }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip formatter={(v) => [`${v} songs`, "Count"]} />
          <Bar dataKey="count" name="Songs" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
