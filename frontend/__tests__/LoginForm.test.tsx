import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../contexts/AuthContext";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockLogin = jest.fn();

function setupMockAuth(overrides: Partial<{ isLoading: boolean; error: string | null }> = {}) {
  (useAuth as jest.Mock).mockReturnValue({
    login: mockLogin,
    isLoading: overrides.isLoading ?? false,
    error: overrides.error ?? null,
  });
}

describe("LoginForm", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockPush.mockReset();
    setupMockAuth();
  });

  it("renders email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("renders the Login submit button", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("shows 'Logging in…' text while loading", () => {
    setupMockAuth({ isLoading: true });
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: "Logging in..." })).toBeInTheDocument();
  });

  it("disables the submit button while loading", () => {
    setupMockAuth({ isLoading: true });
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: "Logging in..." })).toBeDisabled();
  });

  it("displays an error message when error is set", () => {
    setupMockAuth({ error: "Invalid credentials" });
    render(<LoginForm />);
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("does not display error section when error is null", () => {
    setupMockAuth({ error: null });
    render(<LoginForm />);
    expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
  });

  it("toggles password visibility when Show/Hide button is clicked", () => {
    render(<LoginForm />);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const toggleBtn = screen.getByRole("button", { name: "Show" });

    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Hide" }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("calls login with email and password on submit", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Login" }).closest("form")!);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("user@example.com", "secret123");
    });
  });

  it("redirects to /dashboard after successful login", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    render(<LoginForm />);

    fireEvent.submit(screen.getByRole("button", { name: "Login" }).closest("form")!);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("calls onSuccess callback after login", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    const onSuccess = jest.fn();
    render(<LoginForm onSuccess={onSuccess} />);

    fireEvent.submit(screen.getByRole("button", { name: "Login" }).closest("form")!);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("does not redirect when login throws", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Auth error"));
    render(<LoginForm />);

    fireEvent.submit(screen.getByRole("button", { name: "Login" }).closest("form")!);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
