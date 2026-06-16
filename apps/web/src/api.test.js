import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { api, API_BASE_URL } from "./api.js";

describe("api helper", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("API_BASE_URL", () => {
    it("should default to /api when env var is not set", () => {
      expect(API_BASE_URL).toBe("/api");
    });
  });

  describe("api()", () => {
    it("should make a GET request and return JSON", async () => {
      const mockData = { id: "1", title: "Test" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await api("/public/articles");

      expect(fetch).toHaveBeenCalledWith(
        "/api/public/articles",
        expect.objectContaining({
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        })
      );
      expect(result).toEqual(mockData);
    });

    it("should make a POST request with body", async () => {
      const mockData = { success: true };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const body = JSON.stringify({ email: "test@test.com" });
      await api("/public/subscribers", { method: "POST", body });

      expect(fetch).toHaveBeenCalledWith(
        "/api/public/subscribers",
        expect.objectContaining({
          method: "POST",
          body,
          credentials: "include"
        })
      );
    });

    it("should throw error with message on non-ok response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: "Not found" })
      });

      await expect(api("/missing")).rejects.toThrow("Not found");
    });

    it("should throw generic error when body has no message", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({})
      });

      await expect(api("/error")).rejects.toThrow("Request failed: 500");
    });

    it("should merge custom headers", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      });

      await api("/test", { headers: { "X-Custom": "value" } });

      expect(fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          headers: { "Content-Type": "application/json", "X-Custom": "value" }
        })
      );
    });
  });
});
