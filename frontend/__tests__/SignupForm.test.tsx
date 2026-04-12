import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignupForm } from "../components/SignupForm";
import { useAuth } from "../contexts/AuthContext";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockRegister = jest.fn();

function setupMockAuth(overrides: Partial<{ isLoading: boolean; error: string | null }> = {}) {
  (useAuth as jest.Mock).mockReturnValue({
    register: mockRegister,
    isLoading: overrides.isLoading ?? false,
    error: overrides.error ?? null,
  });
}

describe("SignupForm", () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockPush.mockReset();
    setupMockAuth();
  });

  it("renders all form fields", () => {
    render(<SignupForm />);
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    // Two password fields share the same placeholder
    expect(screen.getAllByPlaceholderText("••••••••")).toHaveLength(2);
  });

  it("renders the Sign Up submit button", () => {
    render(<SignupForm />);
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("shows 'Creating account…' when loading", () => {
    setupMockAuth({ isLoading: true });
    render(<SignupForm />);
    expect(screen.getByRole("button", { name: "Creating account..." })).toBeDisabled();
  });

  it("displays auth context error", () => {
    setupMockAuth({ error: "Email already registered" });
    render(<SignupForm />);
    expect(screen.getByText("Email already registered")).toBeInTheDocument();
  });

  it("shows password mismatch error", () => {
    render(<SignupForm />);
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(passwordInput, { target: { value: "password1" } });
    fireEvent.change(confirmInput, { target: { value: "password2" } });
    fireEvent.submit(screen.getByRole("button", { name: "Sign Up" }).closest("form")!);
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("shows short password error when password is fewer than 6 chars", () => {
    render(<SignupForm />);
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(passwordInput, { target: { value: "abc" } });
    fireEvent.change(confirmInput, { target: { value: "abc" } });
    fireEvent.submit(screen.getByRole("button", { name: "Sign Up" }).closest("form")!);
    expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("toggles password visibility on all password fields", () => {
    render(<SignupForm />);
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText("••••••••");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmInput).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "Show" }));
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(confirmInput).toHaveAttribute("type", "text");
  });

  it("calls register with correct arguments on valid submit", async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    render(<SignupForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("username"), {
      target: { value: "newuser" },
    });
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(passwordInput, { target: { value: "securepass" } });
    fireEvent.change(confirmInput, { target: { value: "securepass" } });

    fireEvent.submit(screen.getByRole("button", { name: "Sign Up" }).closest("form")!);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "new@example.com",
        "newuser",
        "securepass",
        ""
      );
    });
  });

  it("redirects to /dashboard after successful registration", async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    render(<SignupForm />);

    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });
    fireEvent.change(confirmInput, { target: { value: "mypassword" } });

    fireEvent.submit(screen.getByRole("button", { name: "Sign Up" }).closest("form")!);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("calls onSuccess callback after successful registration", async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    const onSuccess = jest.fn();
    render(<SignupForm onSuccess={onSuccess} />);

    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });
    fireEvent.change(confirmInput, { target: { value: "mypassword" } });

    fireEvent.submit(screen.getByRole("button", { name: "Sign Up" }).closest("form")!);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("does not redirect when register throws", async () => {
    mockRegister.mockRejectedValueOnce(new Error("Registration error"));
    render(<SignupForm />);

    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });
    fireEvent.change(confirmInput, { target: { value: "mypassword" } });

    fireEvent.submit(screen.getByRole("button", { name: "Sign Up" }).closest("form")!);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
