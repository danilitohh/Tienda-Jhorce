import { createHash, timingSafeEqual } from "node:crypto";

type AdminCredentials = Readonly<{ username: string; password: string }>;

// Normalize only the username so the owner can type it consistently; the password remains exact.
function normalizeAdminUsername(username: string) {
  return username.trim().toLowerCase();
}

// Read private Vercel credentials without ever making them part of a client bundle or API response.
function getConfiguredCredentials(): AdminCredentials | null {
  const username = process.env.ADMIN_USERNAME ? normalizeAdminUsername(process.env.ADMIN_USERNAME) : "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!username || password.length < 8) return null;
  return { username, password };
}

// Keep the admin setup state explicit so the UI can explain missing deployment configuration safely.
export function isAdminAuthConfigured() {
  return getConfiguredCredentials() !== null;
}

// Expose only the configured username for the authenticated admin header, never the password.
export function getConfiguredAdminUsername() {
  return getConfiguredCredentials()?.username ?? null;
}

// Derive a non-reversible credential version so rotating either private value invalidates old sessions.
export function getAdminCredentialFingerprint() {
  const configured = getConfiguredCredentials();
  if (!configured) return null;
  return createHash("sha256").update(`${configured.username}:${configured.password}`).digest("hex");
}

// Compare a submitted password through fixed-length SHA-256 digests and constant-time equality.
export function verifyAdminCredentials(username: string, password: string) {
  const configured = getConfiguredCredentials();
  if (!configured || normalizeAdminUsername(username) !== configured.username) return false;

  const submittedDigest = createHash("sha256").update(password).digest();
  const configuredDigest = createHash("sha256").update(configured.password).digest();
  return timingSafeEqual(submittedDigest, configuredDigest);
}
