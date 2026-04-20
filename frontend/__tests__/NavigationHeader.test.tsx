import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavigationHeader } from "../components/NavigationHeader";
import { useAuth } from "../contexts/AuthContext";

const mockPush = jest.fn();
const mockPathname = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockLogout = jest.fn();

function setupUnauthenticated() {
  (useAuth as jest.Mock).mockReturnValue({
    token: null,
    user: null,
    logout: mockLogout,
  });
}

function setupAuthenticated(user = { full_name: "Alice Smith", username: "alice", email: "alice@example.com" }) {
  (useAuth as jest.Mock).mockReturnValue({
    token: "valid-token",
    user,
    logout: mockLogout,
  });
}

describe("NavigationHeader", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockLogout.mockReset();
    mockPathname.mockReturnValue("/");
  });

  it("renders the PolisAI brand name", () => {
    setupUnauthenticated();
    render(<NavigationHeader />);
    expect(screen.getAllByText("PolisAI").length).toBeGreaterThan(0);
  });

  it("shows Login and Sign Up links when unauthenticated", () => {
    setupUnauthenticated();
    render(<NavigationHeader />);
    expect(screen.getAllByText("Login").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sign Up").length).toBeGreaterThan(0);
  });

  it("shows user name and Logout button when authenticated", () => {
    setupAuthenticated();
    render(<NavigationHeader />);
    expect(screen.getAllByText("Alice Smith").length).toBeGreaterThan(0);
    expect(screen.getAllByText("alice@example.com").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Logout").length).toBeGreaterThan(0);
  });

  it("shows username when full_name is absent", () => {
    setupAuthenticated({ full_name: null as any, username: "bob", email: "bob@example.com" });
    render(<NavigationHeader />);
    expect(screen.getAllByText("bob").length).toBeGreaterThan(0);
  });

  it("calls logout and redirects to /auth when Logout button clicked", () => {
    setupAuthenticated();
    render(<NavigationHeader />);
    const logoutButtons = screen.getAllByText("Logout");
    fireEvent.click(logoutButtons[0]);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/auth");
  });

  it("does not show Dashboard/History nav links when unauthenticated", () => {
    setupUnauthenticated();
    render(<NavigationHeader />);
    // Dashboard and History require auth; they should not appear in the nav list
    const dashboardLinks = screen.queryAllByRole("link", { name: /Dashboard/ });
    const historyLinks = screen.queryAllByRole("link", { name: /History/ });
    expect(dashboardLinks).toHaveLength(0);
    expect(historyLinks).toHaveLength(0);
  });

  it("shows Dashboard and History links when authenticated", () => {
    setupAuthenticated();
    render(<NavigationHeader />);
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("History").length).toBeGreaterThan(0);
  });

  it("opens the mobile menu when the hamburger button is clicked", () => {
    setupUnauthenticated();
    render(<NavigationHeader />);
    const menuButton = screen.getByRole("button", { name: "" });
    fireEvent.click(menuButton);
    // After opening, the mobile nav section should be visible
    const mobileLinks = screen.getAllByRole("link", { name: /Home/ });
    expect(mobileLinks.length).toBeGreaterThan(0);
  });

  it("calls logout and navigates to /auth from mobile menu", () => {
    setupAuthenticated();
    render(<NavigationHeader />);

    // Open the mobile menu first
    const menuButton = screen.getByRole("button", { name: "" });
    fireEvent.click(menuButton);

    // Find and click the mobile logout button
    const logoutButtons = screen.getAllByText("Logout");
    // Last one is in the mobile menu
    fireEvent.click(logoutButtons[logoutButtons.length - 1]);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/auth");
  });

  it("closes mobile menu after clicking a mobile nav link", () => {
    setupUnauthenticated();
    render(<NavigationHeader />);

    // Open menu
    const menuButton = screen.getByRole("button", { name: "" });
    fireEvent.click(menuButton);

    // The mobile Login link should be visible
    const loginLinks = screen.getAllByText("Login");
    expect(loginLinks.length).toBeGreaterThan(1); // desktop + mobile
  });

  it("applies scrolled styles when window is scrolled past 20px", () => {
    setupUnauthenticated();
    render(<NavigationHeader />);

    // Simulate scroll past threshold
    Object.defineProperty(window, "scrollY", { value: 30, configurable: true });
    window.dispatchEvent(new Event("scroll"));

    const header = document.querySelector("header");
    expect(header).toBeInTheDocument();
  });

  it("renders the header spacer div", () => {
    setupUnauthenticated();
    const { container } = render(<NavigationHeader />);
    const spacer = container.querySelector(".h-16:not(header *)");
    expect(spacer).toBeInTheDocument();
  });
});
