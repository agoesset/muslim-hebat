import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSearchResults } from "./public.js";
import { api } from "../api.ts";

vi.mock("../api.ts", () => ({ api: vi.fn() }));

describe("getSearchResults", () => {
  beforeEach(() => vi.clearAllMocks());

  it("trims and encodes the search query", async () => {
    api.mockResolvedValue({ articles: [], products: [], kajian: [], courses: [] });
    await getSearchResults("  doa & sabar  ");
    expect(api).toHaveBeenCalledWith("/public/search?q=doa+%26+sabar");
  });
});
