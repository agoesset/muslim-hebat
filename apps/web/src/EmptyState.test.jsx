import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "./EmptyState.jsx";

describe("EmptyState", () => {
  it("should render title and message", () => {
    const { container } = render(<EmptyState title="Belum ada produk" message="Coba ubah filter." />);

    expect(screen.getByRole("heading", { name: "Belum ada produk" })).toBeInTheDocument();
    expect(screen.getByText("Coba ubah filter.")).toBeInTheDocument();
    expect(container.querySelector(".empty-state")).toBeInTheDocument();
  });

  it("should render the default seedling icon when no icon prop is given", () => {
    const { container } = render(<EmptyState title="Kosong" message="Tidak ada data." />);

    const icon = container.querySelector(".empty-icon");
    expect(icon).toHaveTextContent("🌱");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("should render a custom icon when provided", () => {
    const { container } = render(<EmptyState icon="📚" title="Kosong" message="Tidak ada data." />);

    expect(container.querySelector(".empty-icon")).toHaveTextContent("📚");
  });

  it("should render nothing for title and message when they are omitted", () => {
    const { container } = render(<EmptyState />);

    expect(container.querySelector("h3")).toBeEmptyDOMElement();
    expect(container.querySelector("p")).toBeEmptyDOMElement();
  });

  it("should render the action button when both actionLabel and onAction are given", () => {
    render(<EmptyState title="Kosong" message="Tidak ada data." actionLabel="Reset filter" onAction={vi.fn()} />);

    const button = screen.getByRole("button", { name: "Reset filter" });
    expect(button).toHaveClass("btn", "btn--primary");
  });

  it("should not render the action button when onAction is missing", () => {
    render(<EmptyState title="Kosong" message="Tidak ada data." actionLabel="Reset filter" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should not render the action button when actionLabel is missing", () => {
    render(<EmptyState title="Kosong" message="Tidak ada data." onAction={vi.fn()} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should call onAction when the action button is clicked", () => {
    const onAction = vi.fn();
    render(<EmptyState title="Kosong" message="Tidak ada data." actionLabel="Reset filter" onAction={onAction} />);

    fireEvent.click(screen.getByRole("button", { name: "Reset filter" }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
