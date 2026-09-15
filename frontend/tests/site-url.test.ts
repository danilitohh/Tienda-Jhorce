import { afterEach, describe, expect, it } from "vitest";
import { getSiteUrl, getSiteUrlString } from "@/lib/site-url";

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// Restore the process environment so URL behavior tests remain isolated.
afterEach(() => {
  if (originalSiteUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  }
});

describe("site URL resolution", () => {
  it("falls back when Vercel provides an empty value", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "";

    expect(getSiteUrl().toString()).toBe("http://localhost:3000/");
    expect(getSiteUrlString()).toBe("http://localhost:3000");
  });

  it("accepts a valid HTTP site URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://jhorce.example/";

    expect(getSiteUrlString()).toBe("https://jhorce.example");
  });

  it("falls back when the configured value is malformed", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "not-a-url";

    expect(getSiteUrlString()).toBe("http://localhost:3000");
  });
});
