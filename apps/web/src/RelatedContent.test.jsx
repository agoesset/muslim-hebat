import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RelatedArticles, RelatedProducts, RelatedCourses } from "./RelatedContent.jsx";

/** Anak pertama <section> adalah SectionHeader; grid kartunya anak kedua. */
function grid(container) {
  return container.querySelectorAll("section > div")[1];
}

const articles = [
  { id: 1, title: "Sabar itu proses", excerpt: "Catatan pendek soal sabar.", cat: "Refleksi", emoji: "🌙", color: "var(--lilac)" },
  { id: 2, title: "Rutin subuh", excerpt: "Bangun lebih awal.", cat: "Ibadah", emoji: "☀️", color: "var(--butter)" },
];

const products = [
  { id: 1, name: "Jurnal Tadabbur", cat: "Cetak", emoji: "📓", color: "var(--sage)", price: 75000 },
  { id: 2, name: "Poster Doa", cat: "Digital", emoji: "🖼️", color: "var(--peach)", price: 0 },
];

const courses = [
  { id: 1, title: "Tahsin Dasar", cat: "Quran", level: "Pemula", instructor: "Ustadz Ali", lessons: 8, emoji: "📖", color: "var(--sage)", price: 250000 },
  { id: 2, title: "Fikih Harian", cat: "Fikih", level: "Menengah", instructor: "Ustadz Budi", lessons: 12, emoji: "🕌", color: "var(--lilac)", price: 0 },
];

describe("RelatedArticles", () => {
  it("should render the default heading and one card per article", () => {
    const { container } = render(<RelatedArticles articles={articles} />);

    expect(screen.getByRole("heading", { name: "Bacaan serupa" })).toBeInTheDocument();
    expect(screen.getByText("Mungkin nyambung sama yang barusan kamu baca.")).toBeInTheDocument();
    expect(container.querySelectorAll("article.card")).toHaveLength(2);
  });

  it("should render title, excerpt, category pill and emoji of each article", () => {
    const { container } = render(<RelatedArticles articles={articles} />);

    expect(screen.getByRole("heading", { name: "Sabar itu proses" })).toBeInTheDocument();
    expect(screen.getByText("Catatan pendek soal sabar.")).toBeInTheDocument();
    expect(container.querySelectorAll(".pill")[0]).toHaveTextContent("Refleksi");
    expect(screen.getByText("🌙")).toBeInTheDocument();
  });

  it("should override the heading with custom title and subtitle", () => {
    render(<RelatedArticles articles={articles} title="Lanjut yuk" subtitle="Pilihan editor." />);

    expect(screen.getByRole("heading", { name: "Lanjut yuk" })).toBeInTheDocument();
    expect(screen.getByText("Pilihan editor.")).toBeInTheDocument();
    expect(screen.queryByText("Bacaan serupa")).not.toBeInTheDocument();
  });

  it("should render nothing when the articles list is empty", () => {
    const { container } = render(<RelatedArticles articles={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render nothing when articles is undefined", () => {
    const { container } = render(<RelatedArticles />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should use one grid column per article below three", () => {
    const { container } = render(<RelatedArticles articles={articles} />);

    expect(grid(container)).toHaveStyle({ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" });
  });

  it("should cap the grid at three columns however many articles are given", () => {
    const many = [...articles, { id: 3, title: "C", excerpt: "c", cat: "c", emoji: "🌸" }, { id: 4, title: "D", excerpt: "d", cat: "d", emoji: "🍀" }];
    const { container } = render(<RelatedArticles articles={many} />);

    expect(grid(container)).toHaveStyle({ gridTemplateColumns: "repeat(3, 1fr)" });
    expect(container.querySelectorAll("article.card")).toHaveLength(4);
  });

  it("should call onOpenCerita with the clicked article", () => {
    const onOpenCerita = vi.fn();
    const { container } = render(<RelatedArticles articles={articles} onOpenCerita={onOpenCerita} />);

    fireEvent.click(container.querySelectorAll("article.card")[1]);

    expect(onOpenCerita).toHaveBeenCalledTimes(1);
    expect(onOpenCerita).toHaveBeenCalledWith(articles[1]);
  });

  it("should not throw when a card is clicked without onOpenCerita", () => {
    const { container } = render(<RelatedArticles articles={articles} />);

    expect(() => fireEvent.click(container.querySelector("article.card"))).not.toThrow();
  });

  it("should lift the card on hover and reset it on mouse leave", () => {
    const { container } = render(<RelatedArticles articles={articles} />);
    const card = container.querySelector("article.card");

    fireEvent.mouseEnter(card);
    expect(card).toHaveStyle({ transform: "translateY(-2px)" });

    fireEvent.mouseLeave(card);
    expect(card).toHaveStyle({ transform: "none" });
  });
});

describe("RelatedProducts", () => {
  it("should render the default heading and one card per product", () => {
    const { container } = render(<RelatedProducts products={products} />);

    expect(screen.getByRole("heading", { name: "Produk serupa" })).toBeInTheDocument();
    expect(screen.getByText("Yang lain juga lihat ini.")).toBeInTheDocument();
    expect(container.querySelectorAll("article.card")).toHaveLength(2);
  });

  it("should render name, category and emoji of each product", () => {
    render(<RelatedProducts products={products} />);

    expect(screen.getByRole("heading", { name: "Jurnal Tadabbur" })).toBeInTheDocument();
    expect(screen.getByText("Cetak")).toBeInTheDocument();
    expect(screen.getByText("📓")).toBeInTheDocument();
  });

  it("should format a paid price in rupiah with Indonesian thousand separators", () => {
    render(<RelatedProducts products={products} />);

    expect(screen.getByText("Rp 75.000")).toBeInTheDocument();
  });

  it("should render 'Gratis' instead of a price when the price is zero", () => {
    render(<RelatedProducts products={products} />);

    expect(screen.getByText("Gratis")).toBeInTheDocument();
    expect(screen.queryByText("Rp 0")).not.toBeInTheDocument();
  });

  it("should render nothing when the products list is empty or missing", () => {
    const { container: emptyList } = render(<RelatedProducts products={[]} />);
    const { container: noProp } = render(<RelatedProducts />);

    expect(emptyList).toBeEmptyDOMElement();
    expect(noProp).toBeEmptyDOMElement();
  });

  it("should override the heading with custom title and subtitle", () => {
    render(<RelatedProducts products={products} title="Barang lain" subtitle="Masih satu tema." />);

    expect(screen.getByRole("heading", { name: "Barang lain" })).toBeInTheDocument();
    expect(screen.getByText("Masih satu tema.")).toBeInTheDocument();
  });

  it("should call onOpen with the clicked product", () => {
    const onOpen = vi.fn();
    const { container } = render(<RelatedProducts products={products} onOpen={onOpen} />);

    fireEvent.click(container.querySelectorAll("article.card")[0]);

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith(products[0]);
  });

  it("should not throw when a card is clicked without onOpen", () => {
    const { container } = render(<RelatedProducts products={products} />);

    expect(() => fireEvent.click(container.querySelector("article.card"))).not.toThrow();
  });
});

describe("RelatedCourses", () => {
  it("should render the default heading and one card per course", () => {
    const { container } = render(<RelatedCourses courses={courses} />);

    expect(screen.getByRole("heading", { name: "Kelas lainnya" })).toBeInTheDocument();
    expect(screen.getByText("Mungkin cocok buat kamu.")).toBeInTheDocument();
    expect(container.querySelectorAll("article.card")).toHaveLength(2);
  });

  it("should render category and level together in one line", () => {
    render(<RelatedCourses courses={courses} />);

    expect(screen.getByText("Quran · Pemula")).toBeInTheDocument();
  });

  it("should render the instructor and the lesson count", () => {
    render(<RelatedCourses courses={courses} />);

    expect(screen.getByText("Ustadz Ali · 8 sesi")).toBeInTheDocument();
  });

  it("should format a paid price and show 'Gratis' for a free course", () => {
    render(<RelatedCourses courses={courses} />);

    expect(screen.getByText("Rp 250.000")).toBeInTheDocument();
    expect(screen.getByText("Gratis")).toBeInTheDocument();
  });

  it("should render nothing when the courses list is empty or missing", () => {
    const { container: emptyList } = render(<RelatedCourses courses={[]} />);
    const { container: noProp } = render(<RelatedCourses />);

    expect(emptyList).toBeEmptyDOMElement();
    expect(noProp).toBeEmptyDOMElement();
  });

  it("should call onOpen with the clicked course", () => {
    const onOpen = vi.fn();
    const { container } = render(<RelatedCourses courses={courses} onOpen={onOpen} />);

    fireEvent.click(container.querySelectorAll("article.card")[1]);

    expect(onOpen).toHaveBeenCalledWith(courses[1]);
  });

  it("should not throw when a card is clicked without onOpen", () => {
    const { container } = render(<RelatedCourses courses={courses} />);

    expect(() => fireEvent.click(container.querySelector("article.card"))).not.toThrow();
  });

  /**
   * Perilaku nyata, bukan yang diinginkan: `price` dipakai langsung lewat
   * `price.toLocaleString("id")` tanpa penjagaan, jadi entri tanpa harga
   * melempar TypeError dan merobohkan seluruh halaman. Dicatat, bukan diperbaiki.
   */
  it("should throw when a course has no price field", () => {
    const noPrice = [{ id: 9, title: "Tanpa harga", cat: "Fikih", level: "Pemula", instructor: "Ustadz C", lessons: 4, emoji: "📚" }];
    // React ikut melaporkan error render ke console; dibungkam supaya output test bersih.
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<RelatedCourses courses={noPrice} />)).toThrow(TypeError);

    logged.mockRestore();
  });
});
