import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingState } from "../components/LoadingState";

describe("LoadingState", () => {
  it("renders with default message", () => {
    render(<LoadingState />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders with custom message", () => {
    render(<LoadingState message="Analyzing policy data..." />);
    expect(screen.getByText("Analyzing policy data...")).toBeInTheDocument();
  });

  it("renders inline (not fullScreen) by default", () => {
    const { container } = render(<LoadingState />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveClass("fixed");
    expect(wrapper).toHaveClass("flex");
  });

  it("renders as fixed overlay when fullScreen is true", () => {
    const { container } = render(<LoadingState fullScreen />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("fixed");
    expect(wrapper).toHaveClass("inset-0");
  });

  it("renders the Spinner component", () => {
    const { container } = render(<LoadingState />);
    // Spinner renders an animated div with border-t-accent
    const spinnerEl = container.querySelector(".animate-spin");
    expect(spinnerEl).toBeInTheDocument();
  });
});
