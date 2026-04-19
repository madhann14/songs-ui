"use client";

/** Fixed-height loader container to prevent layout shift during table loading. */
export default function TableLoader() {
  return (
    <div className="min-h-96 flex flex-col gap-4">
      {/* Table-like container to match real table dimensions */}
      <div className="border rounded overflow-hidden h-80">
        <div className="animate-pulse bg-gray-100 h-full" />
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center gap-4">
        <button disabled className="px-3 py-1 border rounded opacity-40">
          ← Previous
        </button>
        <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
        <button disabled className="px-3 py-1 border rounded opacity-40">
          Next →
        </button>
      </div>
    </div>
  );
}
