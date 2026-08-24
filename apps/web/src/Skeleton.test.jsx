import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonGrid,
  SkeletonArticle,
  SkeletonKajianRow,
  SkeletonBatchCard,
} from "./Skeleton.jsx";

const skeletons = (container) => container.querySelectorAll(".skeleton");

describe("Skeleton", () => {
  it("should render a full-width one-em block by default", () => {
    const { container } = render(<Skeleton />);

    const el = container.querySelector(".skeleton");
    expect(el).toBeInTheDocument();
    expect(el).toHaveStyle({ width: "100%" });
    expect(el.style.height).toBe("1em");
  });

  it("should apply numeric width and height as pixels", () => {
    const { container } = render(<Skeleton width={80} height={32} />);

    expect(container.querySelector(".skeleton")).toHaveStyle({ width: "80px", height: "32px" });
  });

  it("should accept string dimensions verbatim", () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />);

    const el = container.querySelector(".skeleton");
    expect(el).toHaveStyle({ width: "50%" });
    expect(el.style.height).toBe("2rem");
  });

  it("should not add the circle modifier by default", () => {
    const { container } = render(<Skeleton />);

    expect(container.querySelector(".skeleton")).not.toHaveClass("skeleton-circle");
  });

  it("should add the circle modifier when circle is true", () => {
    const { container } = render(<Skeleton circle width={40} height={40} />);

    expect(container.querySelector(".skeleton")).toHaveClass("skeleton", "skeleton-circle");
  });

  it("should append a custom className", () => {
    const { container } = render(<Skeleton className="my-skeleton" />);

    expect(container.querySelector(".skeleton")).toHaveClass("skeleton", "my-skeleton");
  });

  it("should apply the style prop to the rendered element", () => {
    // Dipakai oleh SkeletonArticle/SkeletonKajianRow/SkeletonBatchCard/LazyImage:
    // `style` harus sampai ke elemen, bukan dibuang diam-diam.
    const { container } = render(<Skeleton height={24} style={{ width: "60%", marginBottom: 16 }} />);

    const el = container.querySelector(".skeleton");
    expect(el).toHaveStyle({ width: "60%", height: "24px" });
    expect(el.style.marginBottom).toBe("16px");
  });

  it("should let the style prop override the width and height defaults", () => {
    const { container } = render(<Skeleton width={100} height={10} style={{ width: "60%", height: "3rem" }} />);

    const el = container.querySelector(".skeleton");
    expect(el).toHaveStyle({ width: "60%" });
    expect(el.style.height).toBe("3rem");
  });

  it("should apply style properties unrelated to width and height verbatim", () => {
    const { container } = render(
      <Skeleton style={{ marginTop: 24, borderRadius: 999, position: "absolute", inset: 0 }} />
    );

    const el = container.querySelector(".skeleton");
    expect(el).toHaveStyle({ marginTop: "24px", borderRadius: "999px", position: "absolute" });
    expect(el.style.inset).toBe("0px");
    expect(el).toHaveStyle({ width: "100%" });
    expect(el.style.height).toBe("1em");
  });

  it("should behave exactly as before when no style prop is given", () => {
    const { container } = render(<Skeleton width={86} height={86} className="x" />);

    const el = container.querySelector(".skeleton");
    expect(el).toHaveStyle({ width: "86px", height: "86px" });
    expect(el).toHaveClass("skeleton", "x");
    expect(el.getAttribute("style")).toBe("width: 86px; height: 86px;");
  });

  it("should keep a zero width instead of falling back to full width", () => {
    const { container } = render(<Skeleton width={0} />);

    const el = container.querySelector(".skeleton");
    expect(el.style.width).toBe("0px");
  });

  it("should keep a zero height instead of falling back to one em", () => {
    const { container } = render(<Skeleton height={0} />);

    const el = container.querySelector(".skeleton");
    expect(el.style.height).toBe("0px");
  });

  it("should fall back to the defaults when width and height are undefined", () => {
    const { container } = render(<Skeleton width={undefined} height={undefined} />);

    const el = container.querySelector(".skeleton");
    expect(el).toHaveStyle({ width: "100%" });
    expect(el.style.height).toBe("1em");
  });
});

describe("SkeletonText", () => {
  it("should render three lines by default", () => {
    const { container } = render(<SkeletonText />);

    expect(container.querySelectorAll(".skeleton-text")).toHaveLength(3);
  });

  it("should render exactly the requested number of lines", () => {
    const { container } = render(<SkeletonText lines={6} />);

    expect(container.querySelectorAll(".skeleton-text")).toHaveLength(6);
  });

  it("should render nothing when lines is zero", () => {
    const { container } = render(<SkeletonText lines={0} />);

    expect(container.querySelectorAll(".skeleton-text")).toHaveLength(0);
  });

  it("should shorten the last line to 70% and keep the rest full width", () => {
    const { container } = render(<SkeletonText lines={3} />);

    const lines = container.querySelectorAll(".skeleton-text");
    expect(lines[0]).toHaveStyle({ width: "100%" });
    expect(lines[1]).toHaveStyle({ width: "100%" });
    expect(lines[2]).toHaveStyle({ width: "70%" });
  });

  it("should shorten the only line when there is a single line", () => {
    const { container } = render(<SkeletonText lines={1} />);

    expect(container.querySelector(".skeleton-text")).toHaveStyle({ width: "70%" });
  });

  it("should apply the wrapper width", () => {
    const { container } = render(<SkeletonText width="240px" />);

    expect(container.firstChild).toHaveStyle({ width: "240px" });
  });
});

describe("SkeletonCard", () => {
  it("should render as an empty card when there are no children", () => {
    const { container } = render(<SkeletonCard />);

    const card = container.querySelector(".skeleton-card");
    expect(card).toHaveClass("skeleton", "skeleton-card");
    expect(card).toBeEmptyDOMElement();
  });

  it("should render children inside the card", () => {
    render(
      <SkeletonCard>
        <span>isi kartu</span>
      </SkeletonCard>
    );

    expect(screen.getByText("isi kartu")).toBeInTheDocument();
  });

  it("should merge the style prop over the default padding", () => {
    const { container } = render(<SkeletonCard style={{ minHeight: 320 }} />);

    expect(container.firstChild).toHaveStyle({ minHeight: "320px", padding: "0px" });
  });
});

describe("SkeletonGrid", () => {
  it("should render one card per count", () => {
    const { container } = render(<SkeletonGrid count={6} />);

    expect(container.querySelectorAll(".skeleton-card")).toHaveLength(6);
  });

  it("should render no cards when count is zero", () => {
    const { container } = render(<SkeletonGrid count={0} />);

    expect(container.querySelectorAll(".skeleton-card")).toHaveLength(0);
  });

  it("should render no cards when count is omitted", () => {
    const { container } = render(<SkeletonGrid />);

    expect(container.querySelectorAll(".skeleton-card")).toHaveLength(0);
  });

  it("should lay out three columns by default", () => {
    const { container } = render(<SkeletonGrid count={3} />);

    expect(container.firstChild).toHaveStyle({
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
    });
  });

  it("should honour a custom column count and gap", () => {
    const { container } = render(<SkeletonGrid count={2} columns={2} gap={12} />);

    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" });
  });

  it("should apply cardHeight as the minimum height of each card", () => {
    const { container } = render(<SkeletonGrid count={2} cardHeight={200} />);

    container.querySelectorAll(".skeleton-card").forEach((card) => {
      expect(card).toHaveStyle({ minHeight: "200px" });
    });
  });
});

describe("composite skeletons", () => {
  it("should render SkeletonArticle with three circular rail markers", () => {
    const { container } = render(<SkeletonArticle />);

    expect(container.querySelectorAll(".skeleton-circle")).toHaveLength(3);
    expect(skeletons(container)).toHaveLength(14);
  });

  it("should render SkeletonKajianRow inside a card", () => {
    const { container } = render(<SkeletonKajianRow />);

    expect(container.querySelector(".card")).toBeInTheDocument();
    expect(skeletons(container)).toHaveLength(6);
  });

  it("should render SkeletonBatchCard inside a card", () => {
    const { container } = render(<SkeletonBatchCard />);

    expect(container.querySelector(".card")).toBeInTheDocument();
    expect(skeletons(container)).toHaveLength(7);
  });
});
