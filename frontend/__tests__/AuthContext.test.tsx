import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

const mockFetch = jest.fn();
global.fetch = mockFetch;

// Helper to render a component that uses useAuth
function TestConsumer() {
  const { token, user, isLoading, error, login, register, logout } = useAuth();
  return (
    <div>
      <span data-testid="token">{token ?? "null"}</span>
      <span data-testid="user">{user ? JSON.stringify(user) : "null"}</span>
      <span data-testid="loading">{isLoading ? "loading" : "idle"}</span>
      <span data-testid="error">{error ?? "null"}</span>
      <button onClick={() => login("test@example.com", "password").catch(() => {})}>Login</button>
      <button onClick={() => register("test@example.com", "testuser", "password123").catch(() => {})}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

describe("useAuth", () => {
  it("throws when used outside AuthProvider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useAuth must be used within AuthProvider"
    );
    consoleError.mockRestore();
  });
});

describe("AuthProvider", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    localStorage.clear();
  });

  it("starts with null token and user when localStorage is empty", () => {
    renderWithProvider();
    expect(screen.getByTestId("token").textContent).toBe("null");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("loading").textContent).toBe("idle");
    expect(screen.getByTestId("error").textContent).toBe("null");
  });

  it("loads token and user from localStorage on mount", async () => {
    localStorage.setItem("polisai:token", "stored-token");
    localStorage.setItem("polisai:user", JSON.stringify({ email: "user@example.com" }));

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId("token").textContent).toBe("stored-token");
    });
    expect(screen.getByTestId("user").textContent).toContain("user@example.com");
  });

  it("login: sets token and user on success", async () => {
    const accessToken = "test-jwt-token";
    const userData = { email: "test@example.com", username: "testuser" };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: accessToken }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => userData,
      });

    renderWithProvider();

    act(() => { screen.getByText("Login").click(); });

    await waitFor(() => {
      expect(screen.getByTestId("token").textContent).toBe(accessToken);
    });
    expect(screen.getByTestId("user").textContent).toContain("testuser");
    expect(localStorage.getItem("polisai:token")).toBe(accessToken);
  });

  it("login: sets error message on HTTP failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ detail: "Invalid credentials" }),
    });

    renderWithProvider();

    act(() => { screen.getByText("Login").click(); });

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe("Invalid credentials");
    });
    expect(screen.getByTestId("token").textContent).toBe("null");
  });

  it("login: sets network error message when fetch fails", async () => {
    const networkError = new TypeError("Failed to fetch");
    mockFetch.mockRejectedValueOnce(networkError);

    renderWithProvider();

    act(() => { screen.getByText("Login").click(); });

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toContain("NetworkError");
    });
  });

  it("login: sets timeout error message on AbortError", async () => {
    const abortError = new DOMException("aborted", "AbortError");
    mockFetch.mockRejectedValueOnce(abortError);

    renderWithProvider();

    act(() => { screen.getByText("Login").click(); });

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toContain("timeout");
    });
  });

  it("login: falls back to email as user when /auth/me throws", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "tok" }),
      })
      .mockRejectedValueOnce(new Error("Network error on /auth/me"));

    renderWithProvider();

    act(() => { screen.getByText("Login").click(); });

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toContain("test@example.com");
    });
  });

  it("register: calls register endpoint then auto-logs in", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // register
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "reg-token" }),
      }) // login
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ email: "test@example.com", username: "testuser" }),
      }); // /auth/me

    renderWithProvider();

    act(() => { screen.getByText("Register").click(); });

    await waitFor(() => {
      expect(screen.getByTestId("token").textContent).toBe("reg-token");
    }, { timeout: 3000 });
  });

  it("register: sets error message on HTTP failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      text: async () => JSON.stringify({ detail: "Email already registered" }),
    });

    renderWithProvider();

    act(() => { screen.getByText("Register").click(); });

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe("Email already registered");
    });
  });

  it("logout: clears token, user, and localStorage", async () => {
    localStorage.setItem("polisai:token", "existing-token");
    localStorage.setItem("polisai:user", JSON.stringify({ email: "u@example.com" }));

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId("token").textContent).toBe("existing-token");
    });

    act(() => { screen.getByText("Logout").click(); });

    expect(screen.getByTestId("token").textContent).toBe("null");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(localStorage.getItem("polisai:token")).toBeNull();
    expect(localStorage.getItem("polisai:user")).toBeNull();
  });

  it("register: sets timeout error when register request is aborted", async () => {
    const abortError = new DOMException("aborted", "AbortError");
    mockFetch.mockRejectedValueOnce(abortError);

    renderWithProvider();

    act(() => { screen.getByText("Register").click(); });

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toContain("timeout");
    });
  });

  it("register: sets network error when register fetch fails", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    renderWithProvider();

    act(() => { screen.getByText("Register").click(); });

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toContain("NetworkError");
    });
  });

  it("login: sets error.message directly when it does not match known patterns", async () => {
    const customError = new Error("Custom auth error");
    mockFetch.mockRejectedValueOnce(customError);

    renderWithProvider();

    act(() => { screen.getByText("Login").click(); });

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe("Custom auth error");
    });
  });

  it("register: sets error.message directly when it does not match known patterns", async () => {
    const customError = new Error("Custom registration error");
    mockFetch.mockRejectedValueOnce(customError);

    renderWithProvider();

    act(() => { screen.getByText("Register").click(); });

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe("Custom registration error");
    });
  });

  it("login: uses 'Login failed' default when error response JSON has no detail field", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({ message: "bad request" }),
    });

    renderWithProvider();

    act(() => { screen.getByText("Login").click(); });

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe("Login failed");
    });
  });
});
