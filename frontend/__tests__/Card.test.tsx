import React from "react";
import { render, screen } from "@testing-library/react";
import { Card } from "../components/Card";

describe("Card", () => {
  it("renders children content", () => {
    render(<Card><p>Card body text</p></Card>);
    expect(screen.getByText("Card body text")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<Card title="Risk Assessment"><span>content</span></Card>);
    expect(screen.getByText("Risk Assessment")).toBeInTheDocument();
  });

  it("does not render title section when title is omitted", () => {
    render(<Card><span>no title card</span></Card>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("applies additional className from props", () => {
    const { container } = render(<Card className="custom-class"><span>x</span></Card>);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders multiple children", () => {
    render(
      <Card title="Multi">
        <span>Child A</span>
        <span>Child B</span>
      </Card>
    );
    expect(screen.getByText("Child A")).toBeInTheDocument();
    expect(screen.getByText("Child B")).toBeInTheDocument();
  });

  it("renders with default className when none is provided", () => {
    const { container } = render(<Card><span>default</span></Card>);
    expect(container.firstChild).toHaveClass("rounded-[1.75rem]");
  });
});
