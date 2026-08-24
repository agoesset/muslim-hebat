import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NotFoundPage, { NotFoundPage as NamedNotFoundPage } from "./NotFoundPage.jsx";

describe("NotFoundPage", () => {
  it("should expose the same component as default and named export", () => {
    expect(NotFoundPage).toBe(NamedNotFoundPage);
  });

  it("should render the 404 heading and copy", () => {
    render(<NotFoundPage onNav={vi.fn()} />);

    expect(screen.getByRole("heading", { level: 1, name: "Halaman tidak ditemukan" })).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(
      screen.getByText(/Sepertinya halaman yang kamu cari sudah pindah atau memang tidak pernah ada\./)
    ).toBeInTheDocument();
  });

  it("should tag the screen for analytics", () => {
    const { container } = render(<NotFoundPage onNav={vi.fn()} />);

    expect(container.firstChild).toHaveAttribute("data-screen-label", "404");
  });

  it("should render exactly two navigation actions as buttons", () => {
    render(<NotFoundPage onNav={vi.fn()} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons.map((b) => b.textContent.trim())).toEqual(["Ke beranda →", "Jelajahi bacaan"]);
    buttons.forEach((b) => expect(b).toHaveAttribute("type", "button"));
  });

  it("should style the secondary action as muted", () => {
    render(<NotFoundPage onNav={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Ke beranda →" })).toHaveClass("link-text");
    expect(screen.getByRole("button", { name: "Jelajahi bacaan" })).toHaveClass(
      "link-text",
      "link-text--muted"
    );
  });

  it("should call onNav with 'home' when the primary action is clicked", () => {
    const onNav = vi.fn();
    render(<NotFoundPage onNav={onNav} />);

    fireEvent.click(screen.getByRole("button", { name: "Ke beranda →" }));

    expect(onNav).toHaveBeenCalledTimes(1);
    expect(onNav).toHaveBeenCalledWith("home");
  });

  it("should call onNav with 'bacaan' when the secondary action is clicked", () => {
    const onNav = vi.fn();
    render(<NotFoundPage onNav={onNav} />);

    fireEvent.click(screen.getByRole("button", { name: "Jelajahi bacaan" }));

    expect(onNav).toHaveBeenCalledTimes(1);
    expect(onNav).toHaveBeenCalledWith("bacaan");
  });

  it("should set the document title and mark the page noindex via Seo", () => {
    render(<NotFoundPage onNav={vi.fn()} />);

    expect(document.title).toBe("Halaman Tidak Ditemukan");
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  });
});
