import React from "react";
import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "../components/Breadcrumb";

const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe("Breadcrumb", () => {
  it("returns null at the root path", () => {
    mockUsePathname.mockReturnValue("/");
    const { container } = render(<Breadcrumb />);
    expect(container.firstChild).toBeNull();
  });

  it("renders breadcrumbs for a single-segment path", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<Breadcrumb />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders breadcrumbs for a two-segment path", () => {
    mockUsePathname.mockReturnValue("/auth/login");
    render(<Breadcrumb />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Auth")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("capitalizes the first letter of each segment", () => {
    mockUsePathname.mockReturnValue("/sentiment");
    render(<Breadcrumb />);
    expect(screen.getByText("Sentiment")).toBeInTheDocument();
  });

  it("replaces hyphens with spaces in segment names", () => {
    mockUsePathname.mockReturnValue("/policy-analysis");
    render(<Breadcrumb />);
    expect(screen.getByText("Policy analysis")).toBeInTheDocument();
  });

  it("renders the last segment as non-link text", () => {
    mockUsePathname.mockReturnValue("/history");
    render(<Breadcrumb />);
    const activeSegment = screen.getByText("History");
    expect(activeSegment.tagName).not.toBe("A");
  });

  it("renders parent segments as links", () => {
    mockUsePathname.mockReturnValue("/auth/signup");
    render(<Breadcrumb />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/");
    const authLink = screen.getByRole("link", { name: "Auth" });
    expect(authLink).toHaveAttribute("href", "/auth");
  });

  it("renders separator slashes between items", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    const { container } = render(<Breadcrumb />);
    expect(container.textContent).toContain("/");
  });
});
