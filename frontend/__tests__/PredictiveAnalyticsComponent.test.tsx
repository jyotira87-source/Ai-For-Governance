import React from "react";
import { render, screen } from "@testing-library/react";
import { PredictiveAnalytics } from "../components/PredictiveAnalytics";

describe("PredictiveAnalytics component", () => {
  it("renders without crashing", () => {
    const { container } = render(<PredictiveAnalytics score={70} friction={30} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("displays the success probability percentage", () => {
    render(<PredictiveAnalytics score={80} friction={20} />);
    // successProbability = min(95, max(20, 80*1.2 - 20*0.5)) = 86
    // "86.0%" appears in both the probability bar and the forecasted outcomes
    const elements = screen.getAllByText("86.0%");
    expect(elements.length).toBeGreaterThan(0);
  });

  it("displays the stakeholder support percentage", () => {
    render(<PredictiveAnalytics score={80} friction={20} />);
    // stakeholderSupport = max(30, min(95, 80*1.5 - 20*0.8)) = 95
    const elements = screen.getAllByText("95.0%");
    expect(elements.length).toBeGreaterThan(0);
  });

  it("shows 'Improving' risk trend for high score, low friction", () => {
    render(<PredictiveAnalytics score={80} friction={20} />);
    expect(screen.getByText(/Improving/)).toBeInTheDocument();
  });

  it("shows 'Declining' risk trend for high friction", () => {
    render(<PredictiveAnalytics score={50} friction={70} />);
    expect(screen.getByText(/Declining/)).toBeInTheDocument();
  });

  it("renders implementation phases in timeline and table", () => {
    render(<PredictiveAnalytics score={70} friction={30} />);
    // Each phase appears in both the timeline visualization and the table
    const planningElements = screen.getAllByText("Planning & Drafting");
    expect(planningElements.length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Stakeholder Alignment").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Legislative Review").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Implementation & Monitoring").length).toBeGreaterThanOrEqual(2);
  });

  it("renders table headers", () => {
    render(<PredictiveAnalytics score={70} friction={30} />);
    expect(screen.getByText("Phase")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("Risk Level")).toBeInTheDocument();
    expect(screen.getByText("Success Rate")).toBeInTheDocument();
  });

  it("renders scenario analysis section", () => {
    render(<PredictiveAnalytics score={70} friction={30} />);
    expect(screen.getByText(/Optimistic/)).toBeInTheDocument();
    expect(screen.getByText(/Realistic/)).toBeInTheDocument();
    expect(screen.getByText(/Pessimistic/)).toBeInTheDocument();
  });

  it("renders adoption timeline with month count", () => {
    render(<PredictiveAnalytics score={70} friction={30} />);
    expect(screen.getByText("Adoption Timeline")).toBeInTheDocument();
    // adoptionTimeline = max(3, 24 - 70/5 + 30) = 40 months
    const monthsElements = screen.getAllByText(/months/);
    expect(monthsElements.length).toBeGreaterThan(0);
  });

  it("renders the ML model info footer", () => {
    render(<PredictiveAnalytics score={70} friction={30} />);
    expect(screen.getByText(/Data Science Model/)).toBeInTheDocument();
  });

  it("renders risk level badges in the table", () => {
    const { container } = render(<PredictiveAnalytics score={70} friction={30} />);
    const riskBadges = container.querySelectorAll("td span");
    const riskTexts = Array.from(riskBadges).map((el) => el.textContent);
    const validRisks = ["LOW", "MEDIUM", "HIGH"];
    riskTexts.forEach((text) => {
      if (text) expect(validRisks).toContain(text);
    });
  });

  it("renders Success Rate Scenarios heading", () => {
    render(<PredictiveAnalytics score={70} friction={30} />);
    expect(screen.getByText("Success Rate Scenarios")).toBeInTheDocument();
  });
});
