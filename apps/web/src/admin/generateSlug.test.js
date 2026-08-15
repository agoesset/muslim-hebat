import { describe, it, expect } from "vitest";
import { generateSlug } from "./generateSlug.js";

describe("generateSlug", () => {
  it("keeps Indonesian words", () => {
    expect(generateSlug("Belajar membaca")).toBe("belajar-membaca");
  });

  it("strips punctuation without emptying the slug", () => {
    expect(generateSlug("Belajar Qur'an untuk Pemula")).toBe("belajar-quran-untuk-pemula");
  });
});
