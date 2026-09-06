import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// Daftarkan matcher jest-dom secara manual: import "jest-dom/vitest"
// gagal meregistrasi matcher pada beberapa setup dual-install di Windows.
expect.extend(matchers);

// Vitest tidak memakai globals, jadi cleanup RTL harus didaftarkan manual.
afterEach(() => {
  cleanup();
});
