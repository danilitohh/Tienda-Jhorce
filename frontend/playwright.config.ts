import { defineConfig, devices } from "@playwright/test";

// Run the smoke flow against the local Next server, matching the public Vercel route structure.
export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure" },
  webServer: { command: "npm run dev -- --port 3000", url: "http://127.0.0.1:3000", reuseExistingServer: true, timeout: 120000 },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

