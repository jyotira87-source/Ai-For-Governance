import React from "react";
import { render, screen } from "@testing-library/react";
import { Spinner } from "../components/Spinner";

describe("Spinner", () => {
  it("renders without crashing when no size is given", () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders 'Analyzing…' text for medium (default) size", () => {
    render(<Spinner />);
    expect(screen.getByText("Analyzing…")).toBeInTheDocument();
  });

  it("does not show text for sm size", () => {
    render(<Spinner size="sm" />);
    expect(screen.queryByText("Analyzing…")).not.toBeInTheDocument();
  });

  it("does not show text for lg size", () => {
    render(<Spinner size="lg" />);
    expect(screen.queryByText("Analyzing…")).not.toBeInTheDocument();
  });

  it("applies small size class for sm", () => {
    const { container } = render(<Spinner size="sm" />);
    expect(container.querySelector(".h-4.w-4")).toBeInTheDocument();
  });

  it("applies large size class for lg", () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.querySelector(".h-8.w-8")).toBeInTheDocument();
  });

  it("applies medium size class for md (default)", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector(".h-5.w-5")).toBeInTheDocument();
  });
});
