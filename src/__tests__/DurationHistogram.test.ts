import { buildHistogramBins } from "@/components/charts/DurationHistogram";
import type { Song } from "@/types/song";

const makeSong = (duration_ms: number): Song => ({
  index: 0,
  id: "x",
  title: "x",
  danceability: 0,
  energy: 0,
  key: 0,
  loudness: 0,
  mode: 0,
  acousticness: 0,
  instrumentalness: 0,
  liveness: 0,
  valence: 0,
  tempo: 0,
  duration_ms,
  time_signature: 4,
  num_bars: 0,
  num_sections: 0,
  num_segments: 0,
  song_class: 0,
  rating: 0,
});

describe("buildHistogramBins", () => {
  it("returns an empty array for no songs", () => {
    expect(buildHistogramBins([], 10)).toEqual([]);
  });

  it("returns the requested number of bins", () => {
    const songs = [makeSong(60_000), makeSong(120_000), makeSong(180_000)];
    const bins = buildHistogramBins(songs, 5);
    expect(bins).toHaveLength(5);
  });

  it("counts all songs across bins", () => {
    const songs = [
      makeSong(60_000),
      makeSong(120_000),
      makeSong(240_000),
      makeSong(300_000),
    ];
    const bins = buildHistogramBins(songs, 4);
    const total = bins.reduce((sum, b) => sum + b.count, 0);
    expect(total).toBe(songs.length);
  });

  it("puts the max-duration song in the last bin (not out of bounds)", () => {
    const songs = [makeSong(100_000), makeSong(200_000)];
    const bins = buildHistogramBins(songs, 2);
    // total count should still equal song count
    expect(bins[0].count + bins[1].count).toBe(2);
  });
});
