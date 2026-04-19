import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StarRating from "@/components/StarRating";

describe("StarRating", () => {
  it("renders exactly 5 star buttons", () => {
    render(<StarRating value={0} />);
    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("highlights stars up to the current value", () => {
    render(<StarRating value={3} />);
    // Stars 1-3 should be yellow, 4-5 grey — verified via aria-label
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveClass("text-yellow-400");
    expect(buttons[2]).toHaveClass("text-yellow-400");
    expect(buttons[3]).toHaveClass("text-gray-300");
  });

  it("calls onChange with the clicked star number", () => {
    const onChange = jest.fn();
    render(<StarRating value={0} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Rate 3 stars"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("does not call onChange when readOnly", () => {
    const onChange = jest.fn();
    render(<StarRating value={2} onChange={onChange} readOnly />);
    fireEvent.click(screen.getByLabelText("Rate 5 stars"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables all buttons when readOnly", () => {
    render(<StarRating value={3} readOnly />);
    screen.getAllByRole("button").forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});
