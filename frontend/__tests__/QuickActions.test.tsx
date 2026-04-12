import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  QuickActions,
  mainPageActions,
  dashboardActions,
  sentimentActions,
  historyActions,
} from "../components/QuickActions";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const sampleActions = [
  { icon: "📊", title: "Analyze", description: "Run analysis", href: "/analyze" },
  { icon: "📋", title: "Dashboard", description: "View dashboard", href: "/dashboard" },
];

describe("QuickActions", () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it("renders the default title", () => {
    render(<QuickActions actions={sampleActions} />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
  });

  it("renders a custom title when provided", () => {
    render(<QuickActions actions={sampleActions} title="Navigate Faster" />);
    expect(screen.getByText("Navigate Faster")).toBeInTheDocument();
  });

  it("renders all action cards", () => {
    render(<QuickActions actions={sampleActions} />);
    expect(screen.getByText("Analyze")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders action descriptions", () => {
    render(<QuickActions actions={sampleActions} />);
    expect(screen.getByText("Run analysis")).toBeInTheDocument();
    expect(screen.getByText("View dashboard")).toBeInTheDocument();
  });

  it("renders action icons", () => {
    render(<QuickActions actions={sampleActions} />);
    expect(screen.getByText("📊")).toBeInTheDocument();
    expect(screen.getByText("📋")).toBeInTheDocument();
  });

  it("calls router.push with href when an internal action card is clicked", () => {
    render(<QuickActions actions={sampleActions} />);
    fireEvent.click(screen.getByText("Analyze").closest("div")!);
    expect(mockPush).toHaveBeenCalledWith("/analyze");
  });

  it("calls window.open for external actions", () => {
    const externalOpen = jest.spyOn(window, "open").mockImplementation(() => null);
    const externalActions = [
      { icon: "🔗", title: "External", description: "Open link", href: "https://example.com", external: true },
    ];
    render(<QuickActions actions={externalActions} />);
    fireEvent.click(screen.getByText("External").closest("div")!);
    expect(externalOpen).toHaveBeenCalledWith("https://example.com", "_blank");
    externalOpen.mockRestore();
  });

  it("renders empty list when actions array is empty", () => {
    render(<QuickActions actions={[]} />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
  });
});

describe("predefined action sets", () => {
  it("mainPageActions has 3 items", () => {
    expect(mainPageActions).toHaveLength(3);
  });

  it("dashboardActions has 3 items", () => {
    expect(dashboardActions).toHaveLength(3);
  });

  it("sentimentActions has 3 items", () => {
    expect(sentimentActions).toHaveLength(3);
  });

  it("historyActions has 3 items", () => {
    expect(historyActions).toHaveLength(3);
  });

  it("each mainPageAction has required fields", () => {
    mainPageActions.forEach((action) => {
      expect(action.icon).toBeTruthy();
      expect(action.title).toBeTruthy();
      expect(action.description).toBeTruthy();
      expect(action.href).toBeTruthy();
    });
  });
});
