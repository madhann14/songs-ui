"use client";

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (title: string) => void;
  onClear: () => void;
}

export default function SearchBar({ searchQuery, setSearchQuery, onSearch, onClear }: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) onSearch(searchQuery.trim());
  }

  function handleClear() {
    setSearchQuery("");
    onClear();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Enter song title…"
        aria-label="Song title"
        className="border rounded px-3 py-2 w-64 text-sm"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={!searchQuery.trim()}
      >
        Get Song
      </button>
      {searchQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="px-3 py-2 border text-sm rounded hover:bg-gray-100"
        >
          Clear
        </button>
      )}
    </form>
  );
}
