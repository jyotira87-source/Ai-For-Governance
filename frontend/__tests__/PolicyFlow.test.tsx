import React from "react";
import { render, screen } from "@testing-library/react";
import { PolicyFlow } from "../components/PolicyFlow";

describe("PolicyFlow", () => {
  it("renders without crashing", () => {
    const { container } = render(<PolicyFlow />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders all 6 policy steps", () => {
    render(<PolicyFlow />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.getByText("Impact & Rights Analysis")).toBeInTheDocument();
    expect(screen.getByText("Public Consultation")).toBeInTheDocument();
    expect(screen.getByText("Implementation")).toBeInTheDocument();
    expect(screen.getByText("Monitoring")).toBeInTheDocument();
  });

  it("renders step numbers 1 through 6", () => {
    render(<PolicyFlow />);
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it("renders the AI analysis focus description for accent steps", () => {
    render(<PolicyFlow />);
    const descriptions = screen.getAllByText("Deep AI analysis focus point for rights & risk.");
    // Two accent steps: "Impact & Rights Analysis" and "Monitoring"
    expect(descriptions).toHaveLength(2);
  });
});
