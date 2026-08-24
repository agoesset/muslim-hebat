import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastContainer, toast } from "./Toast.jsx";

/**
 * Toast memakai requestAnimationFrame untuk animasi masuk dan setTimeout untuk
 * auto-dismiss. Fake timer vitest hanya memalsukan rAF pada test pertama di satu
 * file, jadi rAF distub sebagai setTimeout satu frame supaya animasi masuk
 * deterministik di semua test — pola yang sama dipakai LazyImage.test.jsx untuk
 * IntersectionObserver.
 */
const FRAME = 16;
const EXIT = 300;

function emit(...args) {
  act(() => {
    toast(...args);
  });
}

function tick(ms) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function items(container) {
  return Array.from(container.firstChild.children);
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("requestAnimationFrame", (cb) => setTimeout(cb, FRAME));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("ToastContainer", () => {
  it("should render an empty fixed overlay before any toast is emitted", () => {
    const { container } = render(<ToastContainer />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle({ position: "fixed", zIndex: "9999" });
    expect(items(container)).toHaveLength(0);
  });

  it("should keep the overlay click-through while each toast captures pointer events", () => {
    const { container } = render(<ToastContainer />);
    emit("Tersimpan");

    expect(container.firstChild).toHaveStyle({ pointerEvents: "none" });
    expect(items(container)[0]).toHaveStyle({ pointerEvents: "auto" });
  });

  it("should render the message of an emitted toast", () => {
    render(<ToastContainer />);

    emit("Artikel tersimpan");

    expect(screen.getByText("Artikel tersimpan")).toBeInTheDocument();
  });

  it("should stack multiple toasts in emission order", () => {
    const { container } = render(<ToastContainer />);

    emit("Pertama");
    emit("Kedua");

    expect(items(container)).toHaveLength(2);
    expect(items(container)[0]).toHaveTextContent("Pertama");
    expect(items(container)[1]).toHaveTextContent("Kedua");
  });

  it("should slide the toast in on the next animation frame", () => {
    const { container } = render(<ToastContainer />);
    emit("Halo");

    expect(items(container)[0]).toHaveStyle({ transform: "translateX(120%)", opacity: "0" });

    tick(FRAME);

    expect(items(container)[0]).toHaveStyle({ transform: "translateX(0)", opacity: "1" });
  });

  it("should hide the toast after the default 3000ms duration and remove it 300ms later", () => {
    const { container } = render(<ToastContainer />);
    emit("Otomatis hilang");

    tick(2999);
    expect(items(container)).toHaveLength(1);

    tick(1);
    expect(items(container)[0]).toHaveStyle({ transform: "translateX(120%)", opacity: "0" });

    tick(EXIT);
    expect(items(container)).toHaveLength(0);
    expect(screen.queryByText("Otomatis hilang")).not.toBeInTheDocument();
  });

  it("should honour a custom duration", () => {
    const { container } = render(<ToastContainer />);
    emit("Sebentar saja", "info", 500);

    tick(499);
    expect(items(container)).toHaveLength(1);

    tick(1 + EXIT);
    expect(items(container)).toHaveLength(0);
  });

  it("should show the info icon by default", () => {
    const { container } = render(<ToastContainer />);

    emit("Tanpa tipe");

    expect(items(container)[0].firstChild).toHaveTextContent("ℹ");
  });

  it.each([
    ["success", "✓"],
    ["error", "✕"],
    ["info", "ℹ"],
    ["warning", "⚠"],
  ])("should show the %s icon", (type, icon) => {
    const { container } = render(<ToastContainer />);

    emit("Pesan", type);

    expect(items(container)[0].firstChild).toHaveTextContent(icon);
  });

  it("should fall back to the info style for an unknown type", () => {
    const { container } = render(<ToastContainer />);

    emit("Tipe ngawur", "kabar-burung");

    expect(items(container)[0].firstChild).toHaveTextContent("ℹ");
    expect(items(container)[0]).toHaveStyle({ background: "var(--lilac)" });
  });

  it("should dismiss a toast when its close button is clicked", () => {
    const { container } = render(<ToastContainer />);
    emit("Tutup aku");
    tick(FRAME);

    fireEvent.click(screen.getByRole("button"));

    expect(items(container)[0]).toHaveStyle({ opacity: "0" });

    tick(EXIT);

    expect(items(container)).toHaveLength(0);
  });

  it("should dismiss only the clicked toast", () => {
    const { container } = render(<ToastContainer />);
    emit("Pertama");
    emit("Kedua");
    tick(FRAME);

    fireEvent.click(screen.getAllByRole("button")[0]);
    tick(EXIT);

    expect(items(container)).toHaveLength(1);
    expect(items(container)[0]).toHaveTextContent("Kedua");
  });

  it("should not throw when a toast is emitted with no container mounted", () => {
    expect(() => toast("Tidak ada yang mendengar")).not.toThrow();
  });

  it("should stop receiving toasts after the container unmounts", () => {
    const { unmount } = render(<ToastContainer />);

    unmount();
    expect(() => toast("Setelah unmount")).not.toThrow();

    const { container } = render(<ToastContainer />);
    expect(items(container)).toHaveLength(0);
  });

  it("should start each container empty rather than replaying earlier toasts", () => {
    const first = render(<ToastContainer />);
    emit("Lama");
    expect(items(first.container)).toHaveLength(1);
    first.unmount();

    const second = render(<ToastContainer />);

    expect(items(second.container)).toHaveLength(0);
  });

  /**
   * Perilaku nyata, bukan yang diinginkan: `remove` dibuat ulang setiap render dan
   * masuk daftar dependency effect ToastItem, jadi setiap toast baru me-restart
   * timer auto-dismiss toast yang sudah tampil. Toast pertama di bawah hidup
   * 1600ms padahal durasinya 1000ms. Dicatat, bukan diperbaiki.
   */
  it("should restart the auto-dismiss timer of existing toasts when a new toast arrives", () => {
    const { container } = render(<ToastContainer />);
    emit("Pertama", "info", 1000);

    tick(600);
    emit("Kedua", "info", 5000);

    tick(400 + EXIT); // 1000ms + animasi keluar sejak toast pertama muncul
    expect(screen.getByText("Pertama")).toBeInTheDocument();

    tick(600 + EXIT); // baru hilang 1000ms setelah toast kedua datang
    expect(screen.queryByText("Pertama")).not.toBeInTheDocument();
    expect(items(container)).toHaveLength(1);
  });
});

describe("toast", () => {
  it("should return nothing to the caller", () => {
    render(<ToastContainer />);

    let returned;
    act(() => {
      returned = toast("Apa balasannya?");
    });

    expect(returned).toBeUndefined();
  });

  it("should deliver every emission to a mounted container", () => {
    const { container } = render(<ToastContainer />);

    emit("Satu");
    emit("Dua");
    emit("Tiga");

    expect(items(container)).toHaveLength(3);
  });

  it("should keep same-message toasts as separate entries", () => {
    const { container } = render(<ToastContainer />);

    emit("Kembar");
    emit("Kembar");

    expect(items(container)).toHaveLength(2);
    expect(screen.getAllByText("Kembar")).toHaveLength(2);
  });
});
