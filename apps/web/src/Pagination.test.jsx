import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination, SortControl } from "./Pagination.jsx";

/** Ambil label semua tombol angka (tanpa tombol prev/next). */
function numberButtons() {
  return screen
    .getAllByRole("button")
    .map((b) => b.textContent)
    .filter((t) => /^\d+$/.test(t));
}

describe("Pagination", () => {
  it("should render nothing when there is only one page", () => {
    const { container } = render(<Pagination page={1} totalPages={1} onChange={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render nothing when there are zero pages", () => {
    const { container } = render(<Pagination page={1} totalPages={0} onChange={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render every page when the total fits in the visible window", () => {
    render(<Pagination page={1} totalPages={3} onChange={vi.fn()} />);

    expect(numberButtons()).toEqual(["1", "2", "3"]);
    expect(screen.queryByText("…")).not.toBeInTheDocument();
  });

  it("should render prev and next controls", () => {
    render(<Pagination page={2} totalPages={3} onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "‹" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "›" })).toBeInTheDocument();
  });

  it("should cap the visible window at 5 pages and show a trailing ellipsis with the last page", () => {
    render(<Pagination page={1} totalPages={10} onChange={vi.fn()} />);

    expect(numberButtons()).toEqual(["1", "2", "3", "4", "5", "10"]);
    expect(screen.getAllByText("…")).toHaveLength(1);
  });

  it("should show a leading ellipsis with the first page when near the end", () => {
    render(<Pagination page={8} totalPages={10} onChange={vi.fn()} />);

    expect(numberButtons()).toEqual(["1", "6", "7", "8", "9", "10"]);
    expect(screen.getAllByText("…")).toHaveLength(1);
  });

  it("should center the window on the current page with ellipses on both sides", () => {
    render(<Pagination page={5} totalPages={10} onChange={vi.fn()} />);

    expect(numberButtons()).toEqual(["1", "3", "4", "5", "6", "7", "10"]);
    expect(screen.getAllByText("…")).toHaveLength(2);
  });

  it("should omit the ellipsis when the boundary page is adjacent to the window", () => {
    render(<Pagination page={4} totalPages={10} onChange={vi.fn()} />);

    // window 2..6, jadi halaman 1 langsung menempel — tidak ada "…" di kiri
    expect(numberButtons()).toEqual(["1", "2", "3", "4", "5", "6", "10"]);
    expect(screen.getAllByText("…")).toHaveLength(1);
  });

  it("should disable prev on the first page and enable next", () => {
    render(<Pagination page={1} totalPages={5} onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "‹" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "›" })).toBeEnabled();
  });

  it("should disable next on the last page and enable prev", () => {
    render(<Pagination page={5} totalPages={5} onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "›" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "‹" })).toBeEnabled();
  });

  it("should mark the current page button with a heavier font weight", () => {
    render(<Pagination page={3} totalPages={5} onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "3" })).toHaveStyle({ fontWeight: "600" });
    expect(screen.getByRole("button", { name: "2" })).toHaveStyle({ fontWeight: "500" });
  });

  it("should call onChange with the clicked page number", () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "4" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("should call onChange with the previous page when prev is clicked", () => {
    const onChange = vi.fn();
    render(<Pagination page={5} totalPages={10} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "‹" }));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("should call onChange with the next page when next is clicked", () => {
    const onChange = vi.fn();
    render(<Pagination page={5} totalPages={10} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "›" }));

    expect(onChange).toHaveBeenCalledWith(6);
  });

  it("should call onChange with the last page when the trailing boundary button is clicked", () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={10} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "10" }));

    expect(onChange).toHaveBeenCalledWith(10);
  });

  it("should not call onChange when a disabled control is clicked", () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "‹" }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("should merge the style prop into the wrapper", () => {
    const { container } = render(
      <Pagination page={1} totalPages={5} onChange={vi.fn()} style={{ marginTop: 0 }} />
    );

    expect(container.firstChild).toHaveStyle({ marginTop: "0px", justifyContent: "center" });
  });
});

describe("SortControl", () => {
  const options = [
    { value: "newest", label: "Terbaru" },
    { value: "oldest", label: "Terlama" },
  ];

  it("should render one option per entry", () => {
    render(<SortControl value="newest" onChange={vi.fn()} options={options} />);

    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.getByRole("option", { name: "Terbaru" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Terlama" })).toBeInTheDocument();
  });

  it("should reflect the selected value", () => {
    render(<SortControl value="oldest" onChange={vi.fn()} options={options} />);

    expect(screen.getByRole("combobox")).toHaveValue("oldest");
  });

  it("should render an empty select when options is empty", () => {
    render(<SortControl value="" onChange={vi.fn()} options={[]} />);

    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("should call onChange with the selected value, not the event", () => {
    const onChange = vi.fn();
    render(<SortControl value="newest" onChange={onChange} options={options} />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "oldest" } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("oldest");
  });
});
