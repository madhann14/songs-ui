import { songsToCSV } from "@/lib/csv";
import type { Song } from "@/types/song";

const base: Song = {
  index: 0,
  id: "abc123",
  title: "Test Song",
  danceability: 0.521,
  energy: 0.673,
  key: 1,
  loudness: -5.0,
  mode: 1,
  acousticness: 0.005,
  instrumentalness: 0.0,
  liveness: 0.1,
  valence: 0.7,
  tempo: 108.031,
  duration_ms: 225947,
  time_signature: 4,
  num_bars: 80,
  num_sections: 8,
  num_segments: 830,
  song_class: 0,
  rating: 0,
};

describe("songsToCSV", () => {
  it("produces a header row with all expected columns", () => {
    const csv = songsToCSV([base]);
    const header = csv.split("\n")[0];
    const expected = [
      "index", "id", "title", "danceability", "energy", "rating",
    ];
    expected.forEach((col) => expect(header).toContain(col));
  });

  it("produces one data row per song", () => {
    const csv = songsToCSV([base, base]);
    const lines = csv.split("\n");
    // header + 2 data rows
    expect(lines).toHaveLength(3);
  });

  it("includes correct values in the data row", () => {
    const csv = songsToCSV([base]);
    const dataRow = csv.split("\n")[1];
    expect(dataRow).toContain("abc123");
    expect(dataRow).toContain("Test Song");
    expect(dataRow).toContain("0.521");
  });

  it("wraps values that contain a comma in double quotes", () => {
    const song = { ...base, title: "Hello, World" };
    const csv = songsToCSV([song]);
    expect(csv).toContain('"Hello, World"');
  });

  it("escapes double quotes inside values", () => {
    const song = { ...base, title: 'Say "Hi"' };
    const csv = songsToCSV([song]);
    expect(csv).toContain('"Say ""Hi"""');
  });

  it("returns only the header row for an empty array", () => {
    const csv = songsToCSV([]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("index");
  });
});
