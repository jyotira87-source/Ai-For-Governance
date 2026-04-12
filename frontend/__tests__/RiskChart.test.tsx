import React from "react";
import { render, screen } from "@testing-library/react";
import { RiskChart } from "../components/RiskChart";

describe("RiskChart", () => {
  it("renders 'No risk data available' when risks array is empty", () => {
    render(<RiskChart risks={[]} />);
    expect(screen.getByText("No risk data available.")).toBeInTheDocument();
  });

  it("renders 'No risk data available' when risks is falsy", () => {
    render(<RiskChart risks={null as any} />);
    expect(screen.getByText("No risk data available.")).toBeInTheDocument();
  });

  it("renders each risk item", () => {
    const risks = ["Budget overrun risk", "Privacy violation risk", "Implementation delay"];
    render(<RiskChart risks={risks} />);
    risks.forEach((risk) => {
      expect(screen.getByText(risk)).toBeInTheDocument();
    });
  });

  it("cycles through threat levels for multiple risks", () => {
    const risks = ["Risk A", "Risk B", "Risk C"];
    render(<RiskChart risks={risks} />);
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
    expect(screen.getByText("ELEVATED")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
  });

  it("renders the legend section", () => {
    render(<RiskChart risks={["any risk"]} />);
    expect(screen.getByText("Critical")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Elevated")).toBeInTheDocument();
  });

  it("renders a single risk item correctly", () => {
    render(<RiskChart risks={["Single risk entry"]} />);
    expect(screen.getByText("Single risk entry")).toBeInTheDocument();
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
  });

  it("wraps back to CRITICAL for the 4th item (cycle of 3)", () => {
    const risks = ["R1", "R2", "R3", "R4"];
    render(<RiskChart risks={risks} />);
    const criticals = screen.getAllByText("CRITICAL");
    expect(criticals).toHaveLength(2); // index 0 and 3
  });

  it("renders progress bars for each risk", () => {
    const { container } = render(<RiskChart risks={["R1", "R2"]} />);
    const bars = container.querySelectorAll(".bg-red-500, .bg-amber-500, .bg-orange-500");
    expect(bars.length).toBeGreaterThan(0);
  });
});
