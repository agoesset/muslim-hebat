import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AdminIcon, renderAdminIcon } from "./lucide-icons.jsx";

function renderIcon(...args) {
  return render(<span data-testid="host">{renderAdminIcon(...args)}</span>);
}

describe("renderAdminIcon", () => {
  it("should render an svg for a known icon name", () => {
    const { container } = renderIcon("articles");

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("lucide");
  });

  it("should render nothing for an unknown icon name", () => {
    const { getByTestId } = renderIcon("tidak-ada");

    expect(getByTestId("host")).toBeEmptyDOMElement();
  });

  it("should render nothing when the name is omitted", () => {
    const { getByTestId } = renderIcon();

    expect(getByTestId("host")).toBeEmptyDOMElement();
  });

  it("should return null rather than an element for an unknown name", () => {
    expect(renderAdminIcon("tidak-ada")).toBeNull();
  });

  it("should default to size 18 when no options are given", () => {
    const { container } = renderIcon("dashboard");

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "18");
    expect(svg).toHaveAttribute("height", "18");
  });

  it("should apply a custom size to both width and height", () => {
    const { container } = renderIcon("dashboard", { size: 32 });

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("should append the className next to the lucide classes", () => {
    const { container } = renderIcon("settings", { className: "admin-nav__icon" });

    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("lucide", "admin-nav__icon");
  });

  it("should apply the style prop to the svg", () => {
    const { container } = renderIcon("warning", { style: { color: "red", marginRight: 6 } });

    expect(container.querySelector("svg")).toHaveStyle({ color: "rgb(255, 0, 0)", marginRight: "6px" });
  });

  it("should mark the icon as decorative so it is skipped by screen readers", () => {
    const { container } = renderIcon("mail");

    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("should render a distinct glyph per icon name", () => {
    const { container: articles } = renderIcon("articles");
    const { container: products } = renderIcon("products");

    expect(articles.querySelector("svg").innerHTML).not.toBe(products.querySelector("svg").innerHTML);
  });

  it.each(Object.keys(AdminIcon))("should render an svg for the '%s' entry", (name) => {
    const { container } = renderIcon(name);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("AdminIcon", () => {
  it("should map every entry to a renderable component", () => {
    const entries = Object.entries(AdminIcon);

    expect(entries.length).toBeGreaterThan(0);
    for (const [, Component] of entries) {
      expect(typeof Component === "function" || typeof Component === "object").toBe(true);
    }
  });

  it("should expose the icon names used by the admin shell", () => {
    expect(Object.keys(AdminIcon)).toEqual(
      expect.arrayContaining(["articles", "products", "kajian", "classes", "dashboard", "content", "settings", "empty"])
    );
  });

  it("should reuse the same sparkle component for logo and sparkle", () => {
    expect(AdminIcon.logo).toBe(AdminIcon.sparkle);
  });

  it("should have no undefined entry", () => {
    expect(Object.values(AdminIcon).filter((c) => !c)).toHaveLength(0);
  });
});
