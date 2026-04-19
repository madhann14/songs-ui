import { render, screen, fireEvent } from "@testing-library/react";
import SongsTable from "@/components/SongsTable";
import type { Song } from "@/types/song";

const makeSong = (overrides: Partial<Song> = {}): Song => ({
  index: 0,
  id: "abc",
  title: "Test Song",
  danceability: 0.5,
  energy: 0.6,
  key: 1,
  loudness: -5,
  mode: 1,
  acousticness: 0.3,
  instrumentalness: 0,
  liveness: 0.1,
  valence: 0.7,
  tempo: 120,
  duration_ms: 200000,
  time_signature: 4,
  num_bars: 50,
  num_sections: 8,
  num_segments: 400,
  song_class: 0,
  rating: 0,
  ...overrides,
});

const defaultProps = {
  songs: [makeSong()],
  total: 1,
  page: 1,
  pageSize: 10,
  sortBy: "index",
  order: "asc" as const,
  loading: false,
  onPageChange: jest.fn(),
  onSort: jest.fn(),
  onRatingChange: jest.fn(),
};

describe("SongsTable", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders a row for each song", () => {
    const songs = [makeSong({ index: 0, title: "Song A" }), makeSong({ index: 1, title: "Song B" })];
    render(<SongsTable {...defaultProps} songs={songs} total={2} />);
    expect(screen.getByText("Song A")).toBeInTheDocument();
    expect(screen.getByText("Song B")).toBeInTheDocument();
  });

  it("shows a loader when loading is true", () => {
    render(<SongsTable {...defaultProps} loading={true} songs={[]} />);
    // Check that a disabled button from the loader is present
    const disabledButtons = screen.getAllByRole("button").filter(btn => btn.getAttribute('disabled') === '');
    expect(disabledButtons.length).toBeGreaterThan(0);
  });

  it("shows a 'no matches' message when there are no songs and not loading", () => {
    render(<SongsTable {...defaultProps} songs={[]} total={0} loading={false} />);
    expect(screen.getByText(/no matches for the current filters/i)).toBeInTheDocument();
  });

  it("calls onSort with the column key when a header is clicked", () => {
    render(<SongsTable {...defaultProps} />);
    // Find the "Title" column header (th element whose text starts with "Title")
    const titleHeader = screen
      .getAllByRole("columnheader")
      .find((el) => el.textContent?.startsWith("Title"));
    fireEvent.click(titleHeader!);
    expect(defaultProps.onSort).toHaveBeenCalledWith("title");
  });

  it("calls onSort with 'danceability' when that header is clicked", () => {
    render(<SongsTable {...defaultProps} />);
    const header = screen
      .getAllByRole("columnheader")
      .find((el) => el.textContent?.startsWith("Danceability"));
    fireEvent.click(header!);
    expect(defaultProps.onSort).toHaveBeenCalledWith("danceability");
  });

  it("disables the Previous button on the first page", () => {
    render(<SongsTable {...defaultProps} page={1} />);
    expect(screen.getByText(/previous/i)).toBeDisabled();
  });

  it("disables the Next button on the last page", () => {
    render(<SongsTable {...defaultProps} total={5} pageSize={10} />);
    expect(screen.getByText(/next/i)).toBeDisabled();
  });

  it("calls onPageChange(2) when Next is clicked", () => {
    render(
      <SongsTable {...defaultProps} total={20} pageSize={10} page={1} />
    );
    fireEvent.click(screen.getByText(/next/i));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it("shows the sort indicator on the active sort column", () => {
    render(<SongsTable {...defaultProps} sortBy="title" order="asc" />);
    const titleHeader = screen
      .getAllByRole("columnheader")
      .find((el) => el.textContent?.startsWith("Title"));
    // ascending indicator is ↑
    expect(titleHeader?.textContent).toContain("↑");
  });
});
