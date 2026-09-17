import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { Collection } from "mongodb";
import { createOpaqueToken, hashOpaqueToken } from "@backend/auth/token-service";
import { getAdminCredentialFingerprint, getConfiguredAdminUsername } from "@/lib/admin-config";
import { getMongoDatabase } from "@/lib/mongodb";

export const ADMIN_SESSION_COOKIE = "byjhor_admin_session";
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type AdminSessionDocument = Readonly<{
  _id: string;
  username: string;
  credentialFingerprint: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}>;

declare global {
  // Reuse the admin index setup across warm Vercel invocations without sharing credentials.
  var adminSessionIndexesPromise: Promise<void> | undefined;
}

// Distinguish an unavailable MongoDB connection from an invalid admin credential.
export class AdminSessionConfigurationError extends Error {
  constructor() {
    super("MongoDB no está configurado para las sesiones administrativas.");
    this.name = "AdminSessionConfigurationError";
  }
}

// Keep the admin session collection isolated from customer sessions and future store collections.
async function getAdminSessions(): Promise<Collection<AdminSessionDocument>> {
  const database = await getMongoDatabase();
  if (!database) throw new AdminSessionConfigurationError();

  const collection = database.collection<AdminSessionDocument>(process.env.MONGODB_ADMIN_SESSIONS_COLLECTION ?? "admin_sessions");
  if (!global.adminSessionIndexesPromise) {
    global.adminSessionIndexesPromise = Promise.all([
      collection.createIndex({ tokenHash: 1 }, { name: "admin_sessions_token_hash_unique", unique: true }),
      collection.createIndex({ expiresAt: 1 }, { name: "admin_sessions_expire_at", expireAfterSeconds: 0 }),
    ]).then(() => undefined).catch((error: unknown) => {
      global.adminSessionIndexesPromise = undefined;
      throw error;
    });
  }
  await global.adminSessionIndexesPromise;
  return collection;
}

// Issue an opaque, eight-hour admin session and persist only token and credential digests in MongoDB.
export async function createAdminSession(username: string) {
  const sessions = await getAdminSessions();
  const credentialFingerprint = getAdminCredentialFingerprint();
  if (!credentialFingerprint) throw new AdminSessionConfigurationError();
  const token = createOpaqueToken();
  const now = new Date();
  await sessions.insertOne({
    _id: randomUUID(),
    username,
    credentialFingerprint,
    tokenHash: hashOpaqueToken(token),
    createdAt: now,
    expiresAt: new Date(now.getTime() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000),
  });
  return token;
}

// Resolve the current admin cookie server-side and invalidate sessions after the configured username changes.
export async function getCurrentAdminSession(): Promise<Readonly<{ username: string }> | null> {
  const configuredUsername = getConfiguredAdminUsername();
  const credentialFingerprint = getAdminCredentialFingerprint();
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!configuredUsername || !credentialFingerprint || !token) return null;

  try {
    const sessions = await getAdminSessions();
    const session = await sessions.findOne({ tokenHash: hashOpaqueToken(token), credentialFingerprint, expiresAt: { $gt: new Date() } });
    if (!session || session.username !== configuredUsername) return null;
    return { username: session.username };
  } catch {
    return null;
  }
}

// Revoke the current admin session before the browser cookie is cleared during logout.
export async function revokeCurrentAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return true;

  try {
    const sessions = await getAdminSessions();
    await sessions.deleteOne({ tokenHash: hashOpaqueToken(token) });
    return true;
  } catch {
    // Preserve the cookie when the server cannot revoke it so logout cannot report a false success.
    return false;
  }
}

// Share the browser-safe cookie policy with customer sessions while enforcing a shorter admin lifetime.
export const adminSessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
};
