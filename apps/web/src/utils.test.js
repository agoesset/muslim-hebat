import { describe, expect, it } from "vitest";
import { formatHijriDate } from "./utils";

describe("formatHijriDate", () => {
  it("formats a valid date in the Islamic calendar", () => {
    const result = formatHijriDate("2026-03-20T00:00:00Z");
    expect(result).toMatch(/1447/);
  });

  it("returns an empty string for an invalid date", () => {
    expect(formatHijriDate("not-a-date")).toBe("");
  });
});
