import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "../components/ErrorBoundary";

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("Test explosion");
  return <div>Safe content</div>;
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Safe content")).toBeInTheDocument();
  });

  it("renders default fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test explosion")).toBeInTheDocument();
  });

  it("renders custom fallback when provided and a child throws", () => {
    render(
      <ErrorBoundary fallback={<div>Custom error UI</div>}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Custom error UI")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("shows Try again button in default fallback", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("resets error state when Try again button is clicked", () => {
    // Use a module-level flag so we can disable throwing before the reset re-render
    let shouldThrowFlag = true;
    function ControllableBomb() {
      if (shouldThrowFlag) throw new Error("Test explosion");
      return <div>Safe content</div>;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ControllableBomb />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Disable throwing BEFORE clicking "Try again" so the re-render succeeds
    shouldThrowFlag = false;
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(screen.getByText("Safe content")).toBeInTheDocument();
  });

  it("shows a generic message when error has no message", () => {
    function SilentBomb() {
      const error = new Error();
      error.message = "";
      throw error;
    }
    render(
      <ErrorBoundary>
        <SilentBomb />
      </ErrorBoundary>
    );
    expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument();
  });
});
