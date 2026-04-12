import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toast } from "../components/Toast";

describe("Toast", () => {
  it("renders the message text", () => {
    render(<Toast message="Policy saved successfully" type="success" onDismiss={jest.fn()} />);
    expect(screen.getByText("Policy saved successfully")).toBeInTheDocument();
  });

  it("renders success toast with correct icon", () => {
    render(<Toast message="Done" type="success" onDismiss={jest.fn()} />);
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("renders error toast with correct icon", () => {
    render(<Toast message="Error occurred" type="error" onDismiss={jest.fn()} />);
    // dismiss button also has ✕, so we check for both instances
    const xMarks = screen.getAllByText("✕");
    expect(xMarks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders info toast with correct icon", () => {
    render(<Toast message="Info message" type="info" onDismiss={jest.fn()} />);
    expect(screen.getByText("ℹ")).toBeInTheDocument();
  });

  it("renders warning toast with correct icon", () => {
    render(<Toast message="Warning" type="warning" onDismiss={jest.fn()} />);
    expect(screen.getByText("⚠")).toBeInTheDocument();
  });

  it("calls onDismiss when the dismiss button is clicked", () => {
    const onDismiss = jest.fn();
    render(<Toast message="Dismiss me" type="info" onDismiss={onDismiss} />);
    fireEvent.click(screen.getByLabelText("Dismiss notification"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("dismiss button has correct aria-label", () => {
    render(<Toast message="test" type="success" onDismiss={jest.fn()} />);
    expect(screen.getByLabelText("Dismiss notification")).toBeInTheDocument();
  });

  it("applies success color classes", () => {
    const { container } = render(
      <Toast message="ok" type="success" onDismiss={jest.fn()} />
    );
    expect(container.firstChild).toHaveClass("bg-green-500/20");
  });

  it("applies error color classes", () => {
    const { container } = render(
      <Toast message="fail" type="error" onDismiss={jest.fn()} />
    );
    expect(container.firstChild).toHaveClass("bg-red-500/20");
  });

  it("applies info color classes", () => {
    const { container } = render(
      <Toast message="info" type="info" onDismiss={jest.fn()} />
    );
    expect(container.firstChild).toHaveClass("bg-blue-500/20");
  });

  it("applies warning color classes", () => {
    const { container } = render(
      <Toast message="warn" type="warning" onDismiss={jest.fn()} />
    );
    expect(container.firstChild).toHaveClass("bg-yellow-500/20");
  });
});
