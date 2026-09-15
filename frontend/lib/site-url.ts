const DEFAULT_SITE_URL = "http://localhost:3000";

// Resolve the public site URL safely during both builds and runtime metadata generation.
export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return new URL(DEFAULT_SITE_URL);
  }

  try {
    const parsedUrl = new URL(configuredUrl);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return new URL(DEFAULT_SITE_URL);
    }

    return parsedUrl;
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

// Return a normalized base string for absolute sitemap and robots URLs.
export function getSiteUrlString(): string {
  return getSiteUrl().toString().replace(/\/$/, "");
}
