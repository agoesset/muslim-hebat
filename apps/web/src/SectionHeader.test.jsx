import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "./SectionHeader.jsx";

describe("SectionHeader", () => {
  it("should render the title as a level-2 heading", () => {
    render(<SectionHeader title="Bacaan Terbaru" />);

    expect(screen.getByRole("heading", { level: 2, name: "Bacaan Terbaru" })).toBeInTheDocument();
  });

  it("should render the kicker above the title", () => {
    render(<SectionHeader kicker="Pilihan editor" title="Bacaan Terbaru" />);

    expect(screen.getByText("Pilihan editor")).toBeInTheDocument();
  });

  it("should render the sub copy when provided", () => {
    const { container } = render(
      <SectionHeader kicker="Pilihan editor" title="Bacaan Terbaru" sub="Kurasi mingguan." />
    );

    expect(screen.getByText("Kurasi mingguan.")).toBeInTheDocument();
    expect(container.querySelector("p")).toHaveTextContent("Kurasi mingguan.");
  });

  it("should omit the sub paragraph entirely when sub is not given", () => {
    const { container } = render(<SectionHeader kicker="Pilihan editor" title="Bacaan Terbaru" />);

    expect(container.querySelector("p")).toBeNull();
  });

  it("should omit the sub paragraph when sub is an empty string", () => {
    const { container } = render(<SectionHeader title="Bacaan Terbaru" sub="" />);

    expect(container.querySelector("p")).toBeNull();
  });

  it("should render the right slot node", () => {
    render(<SectionHeader title="Bacaan Terbaru" right={<button type="button">Lihat semua</button>} />);

    expect(screen.getByRole("button", { name: "Lihat semua" })).toBeInTheDocument();
  });

  it("should render without a right slot", () => {
    render(<SectionHeader title="Bacaan Terbaru" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render with no props at all without crashing", () => {
    const { container } = render(<SectionHeader />);

    expect(container.querySelector("h2")).toBeEmptyDOMElement();
  });
});
