import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest tidak memakai globals, jadi cleanup RTL harus didaftarkan manual.
afterEach(() => {
  cleanup();
});
