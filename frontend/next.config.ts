import type { NextConfig } from "next";
import path from "node:path";

// Allow the curated product photography sources used by the demo catalog.
const nextConfig: NextConfig = {
  // Anchor file tracing to this repository because the host machine has unrelated lockfiles above it.
  outputFileTracingRoot: path.resolve(__dirname, ".."),
  // Keep local Playwright checks on 127.0.0.1 compatible with Next 16 dev resources.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
