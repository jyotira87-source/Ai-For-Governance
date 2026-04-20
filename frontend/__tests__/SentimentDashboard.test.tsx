import React from "react";
import { render, screen } from "@testing-library/react";
import { SentimentDashboard } from "../components/SentimentDashboard";
import { SentimentResponse } from "../lib/api";

const mockData: SentimentResponse = {
  overall_approval: 67.4,
  key_themes: [
    { theme: "Climate Action", sentiment_score: 0.65, mentions: 3200, trend: "rising" },
    { theme: "Economic Cost", sentiment_score: -0.3, mentions: 1800, trend: "falling" },
    { theme: "Job Creation", sentiment_score: 0.1, mentions: 950, trend: "stable" },
  ],
  social_volume: 52000,
  platforms: { twitter: 45, reddit: 35, facebook: 20 },
  languages: { english: 75, spanish: 15, french: 10 },
  last_updated: "2024-06-01T12:00:00Z",
};

describe("SentimentDashboard", () => {
  it("renders overall approval percentage", () => {
    render(<SentimentDashboard data={mockData} />);
    expect(screen.getByText("67.4%")).toBeInTheDocument();
  });

  it("renders opposition percentage (100 - approval)", () => {
    render(<SentimentDashboard data={mockData} />);
    expect(screen.getByText("32.6%")).toBeInTheDocument();
  });

  it("renders social volume in mentions count", () => {
    render(<SentimentDashboard data={mockData} />);
    expect(screen.getByText(/52,000/)).toBeInTheDocument();
  });

  it("renders all key themes", () => {
    render(<SentimentDashboard data={mockData} />);
    expect(screen.getByText("Climate Action")).toBeInTheDocument();
    expect(screen.getByText("Economic Cost")).toBeInTheDocument();
    expect(screen.getByText("Job Creation")).toBeInTheDocument();
  });

  it("renders theme mention counts", () => {
    render(<SentimentDashboard data={mockData} />);
    expect(screen.getByText("3,200 mentions")).toBeInTheDocument();
    expect(screen.getByText("1,800 mentions")).toBeInTheDocument();
    expect(screen.getByText("950 mentions")).toBeInTheDocument();
  });

  it("renders platform distribution labels", () => {
    render(<SentimentDashboard data={mockData} />);
    expect(screen.getByText("twitter")).toBeInTheDocument();
    expect(screen.getByText("reddit")).toBeInTheDocument();
    expect(screen.getByText("facebook")).toBeInTheDocument();
  });

  it("renders language distribution labels", () => {
    render(<SentimentDashboard data={mockData} />);
    expect(screen.getByText("english")).toBeInTheDocument();
    expect(screen.getByText("spanish")).toBeInTheDocument();
    expect(screen.getByText("french")).toBeInTheDocument();
  });

  it("renders the last updated timestamp", () => {
    render(<SentimentDashboard data={mockData} />);
    expect(screen.getByText(/Last updated/)).toBeInTheDocument();
  });

  it("shows positive sentiment score in green for high positive themes", () => {
    const { container } = render(<SentimentDashboard data={mockData} />);
    const positiveScore = container.querySelector(".text-emerald-400");
    expect(positiveScore).toBeInTheDocument();
  });

  it("shows negative sentiment score in red for negative themes", () => {
    const { container } = render(<SentimentDashboard data={mockData} />);
    const negativeScore = container.querySelector(".text-red-400");
    expect(negativeScore).toBeInTheDocument();
  });

  it("shows trend indicators with correct symbols", () => {
    render(<SentimentDashboard data={mockData} />);
    expect(screen.getByText(/↗️.*rising/i)).toBeInTheDocument();
    expect(screen.getByText(/↘️.*falling/i)).toBeInTheDocument();
    expect(screen.getByText(/→.*stable/i)).toBeInTheDocument();
  });

  it("renders 'Public Approval' label", () => {
    render(<SentimentDashboard data={mockData} />);
    expect(screen.getByText("Public Approval")).toBeInTheDocument();
  });

  it("renders 'Opposition' label", () => {
    render(<SentimentDashboard data={mockData} />);
    expect(screen.getByText("Opposition")).toBeInTheDocument();
  });
});
