import { createHash, randomBytes } from "node:crypto";

// Generate unguessable values for sessions and email links; callers receive the raw token only once.
export function createOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

// Persist only a one-way token digest so a database read cannot replay an active session or email link.
export function hashOpaqueToken(token: string): string {
  return createHash("sha256").update(token).digest("base64url");
}
