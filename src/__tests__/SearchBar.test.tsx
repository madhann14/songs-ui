import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";

describe("SearchBar", () => {
  const mockSetSearchQuery = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();

  afterEach(() => jest.clearAllMocks());

  it("renders the input and Get Song button", () => {
    render(
      <SearchBar
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );
    expect(screen.getByPlaceholderText(/song title/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get song/i })).toBeInTheDocument();
  });

  it("disables the Get Song button when input is empty", () => {
    render(
      <SearchBar
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );
    expect(screen.getByRole("button", { name: /get song/i })).toBeDisabled();
  });

  it("enables Get Song once the user types a title", () => {
    render(
      <SearchBar
        searchQuery="3AM"
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );
    expect(screen.getByRole("button", { name: /get song/i })).not.toBeDisabled();
  });

  it("calls onSearch with the trimmed query on submit", () => {
    render(
      <SearchBar
        searchQuery="  3AM  "
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /get song/i }));
    expect(mockOnSearch).toHaveBeenCalledWith("3AM");
  });

  it("shows a Clear button when input has text, and calls onClear when clicked", () => {
    render(
      <SearchBar
        searchQuery="hello"
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );
    const clearBtn = screen.getByRole("button", { name: /clear/i });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);
    expect(mockSetSearchQuery).toHaveBeenCalledWith("");
    expect(mockOnClear).toHaveBeenCalled();
  });

  it("calls setSearchQuery when the input value changes", () => {
    render(
      <SearchBar
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );
    const input = screen.getByPlaceholderText(/song title/i);
    fireEvent.change(input, { target: { value: "new value" } });
    expect(mockSetSearchQuery).toHaveBeenCalledWith("new value");
  });
});
