import { createHash } from "node:crypto";
import { consumeAuthRateLimit } from "@/lib/auth-data";
import type { NextRequest } from "next/server";

type AuthRateLimitRule = Readonly<{ bucket: "ip" | "account"; maxAttempts: number; windowMs: number }>;

// Prefer the platform-provided client address and fall back to a shared bucket for local/direct requests.
function getClientAddress(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

// Hash rate-limit dimensions so raw customer emails and network identifiers are never stored in MongoDB.
function hashBucket(action: string, bucket: string, value: string) {
  return createHash("sha256").update(`byjhor-auth:${action}:${bucket}:${value}`).digest("hex");
}

// Apply all configured quotas before scrypt or transactional email is reached by an unauthenticated request.
export async function isAuthRateLimited(request: NextRequest, action: string, account: string, rules: ReadonlyArray<AuthRateLimitRule>) {
  const clientAddress = getClientAddress(request);
  const checks = await Promise.all(rules.map((rule) => consumeAuthRateLimit(hashBucket(action, rule.bucket, rule.bucket === "ip" ? clientAddress : account), rule.maxAttempts, rule.windowMs)));
  return checks.some((allowed) => !allowed);
}
