import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { LazyImage } from "./LazyImage.jsx";

/**
 * jsdom tidak punya IntersectionObserver. Stub ini merekam instance yang dibuat
 * supaya test bisa memicu callback secara manual.
 */
let observers = [];

class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.observed = [];
    this.disconnectCount = 0;
    observers.push(this);
  }

  observe(node) {
    this.observed.push(node);
  }

  disconnect() {
    this.disconnectCount += 1;
  }

  unobserve() {}
}

function scrollIntoView(observer = observers[0]) {
  act(() => {
    observer.callback([{ isIntersecting: true }], observer);
  });
}

beforeEach(() => {
  observers = [];
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("LazyImage", () => {
  it("should render a placeholder container without an image before it scrolls into view", () => {
    const { container } = render(<LazyImage src="/foto.jpg" alt="Foto kajian" />);

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector(".skeleton")).toBeInTheDocument();
  });

  it("should observe its own container element with a 200px root margin", () => {
    const { container } = render(<LazyImage src="/foto.jpg" alt="Foto kajian" />);

    expect(observers).toHaveLength(1);
    expect(observers[0].observed).toEqual([container.firstChild]);
    expect(observers[0].options).toEqual({ rootMargin: "200px" });
  });

  it("should render the image once it enters the viewport", () => {
    render(<LazyImage src="/foto.jpg" alt="Foto kajian" />);

    scrollIntoView();

    const img = screen.getByRole("img", { name: "Foto kajian" });
    expect(img).toHaveAttribute("src", "/foto.jpg");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("should disconnect the observer after the first intersection", () => {
    render(<LazyImage src="/foto.jpg" alt="Foto kajian" />);

    expect(observers[0].disconnectCount).toBe(0);

    scrollIntoView();

    expect(observers[0].disconnectCount).toBeGreaterThanOrEqual(1);
  });

  it("should stay in placeholder state when the entry is not intersecting", () => {
    render(<LazyImage src="/foto.jpg" alt="Foto kajian" />);

    act(() => {
      observers[0].callback([{ isIntersecting: false }], observers[0]);
    });

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(observers[0].disconnectCount).toBe(0);
  });

  it("should not render an image when src is missing even after intersecting", () => {
    const { container } = render(<LazyImage alt="Tanpa gambar" />);

    scrollIntoView();

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector(".skeleton")).toBeInTheDocument();
  });

  it("should keep the image transparent until it fires onLoad", () => {
    render(<LazyImage src="/foto.jpg" alt="Foto kajian" />);
    scrollIntoView();

    expect(screen.getByRole("img")).toHaveStyle({ opacity: "0" });
  });

  it("should reveal the image and drop the skeleton after onLoad", () => {
    const { container } = render(<LazyImage src="/foto.jpg" alt="Foto kajian" />);
    scrollIntoView();

    fireEvent.load(screen.getByRole("img"));

    expect(screen.getByRole("img")).toHaveStyle({ opacity: "1" });
    expect(container.querySelector(".skeleton")).not.toBeInTheDocument();
  });

  it("should disconnect the observer on unmount", () => {
    const { unmount } = render(<LazyImage src="/foto.jpg" alt="Foto kajian" />);

    unmount();

    expect(observers[0].disconnectCount).toBe(1);
  });

  it("should default to a full-width container when no width is given", () => {
    const { container } = render(<LazyImage src="/foto.jpg" alt="Foto kajian" />);

    expect(container.firstChild).toHaveStyle({ width: "100%", overflow: "hidden" });
  });

  it("should apply explicit width and height to the container", () => {
    const { container } = render(<LazyImage src="/foto.jpg" alt="Foto" width={320} height={200} />);

    expect(container.firstChild).toHaveStyle({ width: "320px", height: "200px" });
  });

  it("should apply the className to the container", () => {
    const { container } = render(<LazyImage src="/foto.jpg" alt="Foto" className="cover" />);

    expect(container.firstChild).toHaveClass("cover");
  });

  it("should merge containerStyle over the defaults", () => {
    const { container } = render(
      <LazyImage src="/foto.jpg" alt="Foto" containerStyle={{ borderRadius: "0px" }} />
    );

    expect(container.firstChild).toHaveStyle({ borderRadius: "0px" });
  });

  it("should use the placeholderColor as the container background", () => {
    const { container } = render(<LazyImage src="/foto.jpg" alt="Foto" placeholderColor="#eee" />);

    expect(container.firstChild).toHaveStyle({ background: "#eee" });
  });

  it("should merge the style prop into the image", () => {
    render(<LazyImage src="/foto.jpg" alt="Foto" style={{ objectFit: "contain" }} />);
    scrollIntoView();

    expect(screen.getByRole("img")).toHaveStyle({ objectFit: "contain" });
  });
});
