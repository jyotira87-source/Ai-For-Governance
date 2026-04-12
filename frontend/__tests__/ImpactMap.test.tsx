import React from "react";
import { render, screen } from "@testing-library/react";
import { ImpactMap } from "../components/ImpactMap";

describe("ImpactMap", () => {
  const impact = ["Affects healthcare access", "Impacts housing market"];
  const simulation = ["Urban residents gain benefit", "Rural areas see mixed results"];

  it("renders without crashing", () => {
    const { container } = render(<ImpactMap impact={impact} simulation={simulation} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders all simulation items", () => {
    render(<ImpactMap impact={impact} simulation={simulation} />);
    expect(screen.getByText("Urban residents gain benefit")).toBeInTheDocument();
    expect(screen.getByText("Rural areas see mixed results")).toBeInTheDocument();
  });

  it("renders all impact items", () => {
    render(<ImpactMap impact={impact} simulation={simulation} />);
    expect(screen.getByText("Affects healthcare access")).toBeInTheDocument();
    expect(screen.getByText("Impacts housing market")).toBeInTheDocument();
  });

  it("renders the Demographic Simulation heading", () => {
    render(<ImpactMap impact={impact} simulation={simulation} />);
    expect(screen.getByText("Demographic Simulation")).toBeInTheDocument();
  });

  it("renders the Systemic Impact heading", () => {
    render(<ImpactMap impact={impact} simulation={simulation} />);
    expect(screen.getByText("Systemic Impact")).toBeInTheDocument();
  });

  it("renders gracefully with empty arrays", () => {
    const { container } = render(<ImpactMap impact={[]} simulation={[]} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText("Demographic Simulation")).toBeInTheDocument();
    expect(screen.getByText("Systemic Impact")).toBeInTheDocument();
  });
});
