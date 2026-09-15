import { defineConfig } from "vitest/config";
import path from "node:path";

// Vitest shares the same frontend/backend aliases used by the application build.
export default defineConfig({
  test: { environment: "jsdom", setupFiles: ["./tests/setup.ts"], include: ["tests/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname), "@backend": path.resolve(__dirname, "../backend/src") } },
});
