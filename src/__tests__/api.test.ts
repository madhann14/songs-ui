import { getSongs, updateRating } from "@/lib/api";

// Replace the global fetch with a Jest mock
global.fetch = jest.fn();

function mockResponse(data: unknown, ok = true) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status: ok ? 200 : 404,
    json: async () => data,
  });
}

describe("api", () => {
  afterEach(() => jest.clearAllMocks());

  // ── getSongs ────────────────────────────────────────────────────────────

  describe("getSongs", () => {
    it("builds the correct URL with default params", async () => {
      mockResponse({ total: 0, page: 1, page_size: 10, songs: [] });
      await getSongs();
      const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
      expect(url).toContain("/songs?");
      expect(url).toContain("page=1");
      expect(url).toContain("page_size=10");
      expect(url).toContain("sort_by=index");
      expect(url).toContain("order=asc");
      expect(url).toContain("search_query=");
    });

    it("passes custom page, pageSize, search_query, sortBy and order", async () => {
      mockResponse({ total: 0, page: 2, page_size: 5, songs: [] });
      await getSongs(2, 5, "3AM", "title", "desc");
      const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
      expect(url).toContain("page=2");
      expect(url).toContain("page_size=5");
      expect(url).toContain("search_query=3AM");
      expect(url).toContain("sort_by=title");
      expect(url).toContain("order=desc");
    });

    it("returns parsed JSON on success", async () => {
      const payload = { total: 1, page: 1, page_size: 10, songs: [] };
      mockResponse(payload);
      const result = await getSongs();
      expect(result).toEqual(payload);
    });

    it("throws when the response is not ok", async () => {
      mockResponse(null, false);
      await expect(getSongs()).rejects.toThrow("Failed to fetch songs");
    });
  });

  // ── updateRating ────────────────────────────────────────────────────────

  describe("updateRating", () => {
    it("sends a PATCH request to the correct endpoint", async () => {
      mockResponse({ index: 5, rating: 4 });
      await updateRating(5, 4);
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0] as [
        string,
        RequestInit
      ];
      expect(url).toContain("/songs/5/rating");
      expect(options.method).toBe("PATCH");
      expect(JSON.parse(options.body as string)).toEqual({ rating: 4 });
    });

    it("returns the updated song", async () => {
      const updated = { index: 0, rating: 3 };
      mockResponse(updated);
      const result = await updateRating(0, 3);
      expect(result).toEqual(updated);
    });

    it("throws on failure", async () => {
      mockResponse(null, false);
      await expect(updateRating(0, 5)).rejects.toThrow("Failed to update rating");
    });
  });
});
