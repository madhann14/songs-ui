"use client";

import { useState, useEffect, useCallback, use } from "react";
import { getSongs, updateRating } from "@/lib/api";
import { downloadCSV } from "@/lib/csv";
import SongsTable from "@/components/SongsTable";
import SearchBar from "@/components/SearchBar";
import DanceabilityScatter from "@/components/charts/DanceabilityScatter";
import DurationHistogram from "@/components/charts/DurationHistogram";
import AcousticTempoBar from "@/components/charts/AcousticTempoBar";
import type { Song, PaginatedSongsResponse } from "@/types/song";

const PAGE_SIZE = 10;

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("index");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [allSongs, setAllSongs] = useState<Song[]>([]);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: PaginatedSongsResponse = await getSongs(
        page,
        PAGE_SIZE,
        searchQuery,
        sortBy,
        order
      );
      setSongs(data.songs);
      setTotal(data.total);
    } catch {
      setError("Failed to load songs. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, order]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchPage();
    }
  }, [searchQuery]);

  useEffect(() => {
    getSongs(1, 100, "", "index", "asc")
      .then((data: PaginatedSongsResponse) => setAllSongs(data.songs))
      .catch(() => { });
  }, []);

  async function handleSearch(title: string) {
    setError(null);
    try {
      const songs: Song[] = await getSongs(1, 10, title).then((data) => data.songs);
      setSongs(songs);
    } catch {
      setError(`No song found with title "${title}".`);
    }
  }

  function handleSort(column: string) {
    if (sortBy === column) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setOrder("asc");
    }
    setPage(1);
  }

  async function handleRating(index: number, rating: number) {
    try {
      await updateRating(index, rating);
      const patch = (list: Song[]) =>
        list.map((s) => (s.index === index ? { ...s, rating } : s));
      setSongs(patch);
      setAllSongs(patch);
    } catch {
      setError("Failed to save rating.");
    }
  }

  return (
    <main className="max-w-screen-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-1">Songs Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">
        Browse, sort, search, and rate songs from the playlist dataset.
      </p>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          onClear={() => {
            setSearchQuery("");
            fetchPage();
          }}
        />
        <button
          onClick={() => downloadCSV(songs)}
          disabled={songs.length === 0}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-100 disabled:opacity-40"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      {/* Songs table */}
      <SongsTable
        songs={songs}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        sortBy={sortBy}
        order={order}
        loading={loading}
        onPageChange={setPage}
        onSort={handleSort}
        onRatingChange={handleRating}
      />

      {/* Charts */}
      {allSongs.length > 0 && (
        <section className="mt-12 space-y-10">
          <h2 className="text-lg font-semibold border-t pt-6">Charts</h2>
          <DanceabilityScatter songs={allSongs} />
          <DurationHistogram songs={allSongs} />
          <AcousticTempoBar songs={allSongs} />
        </section>
      )}
    </main>
  );
}
