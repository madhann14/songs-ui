"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Song } from "@/types/song";

interface Props {
  songs: Song[];
}

interface TooltipPayload {
  payload: { index: number; danceability: number; title: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border rounded p-2 text-xs shadow">
      <p className="font-semibold">{d.title}</p>
      <p>Danceability: {d.danceability.toFixed(3)}</p>
    </div>
  );
}

/**
 * Scatter chart — one dot per song.
 * X axis = song index, Y axis = danceability (0–1).
 */
export default function DanceabilityScatter({ songs }: Props) {
  if (!songs.length) return null;

  const data = songs.map((s) => ({
    index: s.index,
    danceability: s.danceability,
    title: s.title,
  }));

  return (
    <div>
      <h2 className="text-base font-semibold mb-2">
        Danceability by Song Index
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="index"
            name="Song Index"
            label={{ value: "Song Index", position: "insideBottom", offset: -15 }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            dataKey="danceability"
            name="Danceability"
            domain={[0, 1]}
            label={{ value: "Danceability", angle: -90, position: "insideLeft", offset: 10 }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data} fill="#6366f1" opacity={0.8} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
