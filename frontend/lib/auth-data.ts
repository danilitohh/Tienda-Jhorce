import { randomUUID } from "node:crypto";
import type { AuthenticatedUser, StoreRole } from "@backend/auth/auth-types";
import { hashPassword, verifyPassword } from "@backend/auth/password-service";
import { createOpaqueToken, hashOpaqueToken } from "@backend/auth/token-service";
import type { Collection } from "mongodb";
import { getMongoDatabase } from "@/lib/mongodb";

type AuthTokenKind = "email-verification" | "password-reset";

type UserDocument = Readonly<{
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: StoreRole;
  emailVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}>;

type SessionDocument = Readonly<{
  _id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}>;

type AuthTokenDocument = Readonly<{
  _id: string;
  userId: string;
  kind: AuthTokenKind;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  usedAt?: Date;
}>;

type AuthRateLimitDocument = Readonly<{
  _id: string;
  count: number;
  expiresAt: Date;
  updatedAt: Date;
}>;

type AuthCollections = Readonly<{
  users: Collection<UserDocument>;
  sessions: Collection<SessionDocument>;
  tokens: Collection<AuthTokenDocument>;
  rateLimits: Collection<AuthRateLimitDocument>;
}>;

type NewUserInput = Readonly<{ firstName: string; lastName: string; email: string; password: string }>;

declare global {
  // Reuse the index setup promise across warm Vercel invocations without exposing any connection details.
  var authIndexesPromise: Promise<void> | undefined;
}

// Distinguish an absent MongoDB integration from a temporary database failure in API responses.
export class AuthConfigurationError extends Error {
  constructor() {
    super("MongoDB no está configurado para la autenticación.");
    this.name = "AuthConfigurationError";
  }
}

// Keep all collection names server-configurable so this auth module can coexist with the store's current data.
function getCollectionNames() {
  return {
    users: process.env.MONGODB_USERS_COLLECTION ?? "users",
    sessions: process.env.MONGODB_AUTH_SESSIONS_COLLECTION ?? "auth_sessions",
    tokens: process.env.MONGODB_AUTH_TOKENS_COLLECTION ?? "auth_tokens",
    rateLimits: process.env.MONGODB_AUTH_RATE_LIMITS_COLLECTION ?? "auth_rate_limits",
  };
}

// MongoDB is the sole runtime dependency for identity; an absent URI intentionally leaves auth disabled.
export function isMongoAuthConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

// Create the uniqueness and expiry guarantees once per warm runtime, while query filters still enforce expiry exactly.
async function ensureAuthIndexes(collections: AuthCollections) {
  if (!global.authIndexesPromise) {
    global.authIndexesPromise = Promise.all([
      collections.users.createIndex({ email: 1 }, { name: "users_email_unique", unique: true }),
      collections.sessions.createIndex({ tokenHash: 1 }, { name: "sessions_token_hash_unique", unique: true }),
      collections.sessions.createIndex({ expiresAt: 1 }, { name: "sessions_expire_at", expireAfterSeconds: 0 }),
      collections.tokens.createIndex({ tokenHash: 1 }, { name: "tokens_token_hash_unique", unique: true }),
      collections.tokens.createIndex({ expiresAt: 1 }, { name: "tokens_expire_at", expireAfterSeconds: 0 }),
      collections.rateLimits.createIndex({ expiresAt: 1 }, { name: "auth_rate_limits_expire_at", expireAfterSeconds: 0 }),
    ]).then(() => undefined).catch((error: unknown) => {
      global.authIndexesPromise = undefined;
      throw error;
    });
  }

  await global.authIndexesPromise;
}

// Resolve the three auth collections together to prevent endpoint code from duplicating persistence knowledge.
async function getAuthCollections(): Promise<AuthCollections> {
  const database = await getMongoDatabase();
  if (!database) throw new AuthConfigurationError();

  const names = getCollectionNames();
  const collections = {
    users: database.collection<UserDocument>(names.users),
    sessions: database.collection<SessionDocument>(names.sessions),
    tokens: database.collection<AuthTokenDocument>(names.tokens),
    rateLimits: database.collection<AuthRateLimitDocument>(names.rateLimits),
  };

  await ensureAuthIndexes(collections);
  return collections;
}

// Consume a durable, atomic MongoDB quota before public authentication work is allowed to run.
export async function consumeAuthRateLimit(key: string, maxAttempts: number, windowMs: number) {
  const { rateLimits } = await getAuthCollections();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);
  const document = await rateLimits.findOneAndUpdate(
    { _id: key },
    [{ $set: {
      count: { $cond: [{ $gt: ["$expiresAt", now] }, { $add: [{ $ifNull: ["$count", 0] }, 1] }, 1] },
      expiresAt: { $cond: [{ $gt: ["$expiresAt", now] }, "$expiresAt", expiresAt] },
      updatedAt: now,
    } }],
    { upsert: true, returnDocument: "after" },
  );
  return Boolean(document && document.count <= maxAttempts);
}

// Serialize only fields that are safe to render in account pages and session responses.
function toAuthenticatedUser(user: UserDocument): AuthenticatedUser {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    // Admin access is no longer derived from a customer email; customer sessions stay customer-only.
    role: "customer",
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
  };
}

// Create an unverified customer account; admin access is handled by a separate credential boundary.
export async function createPendingUser(input: NewUserInput) {
  const { users } = await getAuthCollections();
  const now = new Date();
  const user: UserDocument = {
    _id: randomUUID(),
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    passwordHash: await hashPassword(input.password),
    role: "customer",
    createdAt: now,
    updatedAt: now,
  };

  try {
    await users.insertOne(user);
    return { created: true as const, user: toAuthenticatedUser(user) };
  } catch (error: unknown) {
    if (typeof error === "object" && error && Reflect.get(error, "code") === 11000) return { created: false as const };
    throw error;
  }
}

// Remove a never-verified account only when its initial confirmation email could not be sent.
export async function discardPendingUser(userId: string) {
  const { tokens, users } = await getAuthCollections();
  await Promise.all([
    tokens.deleteMany({ userId }),
    users.deleteOne({ _id: userId, emailVerifiedAt: { $exists: false } }),
  ]);
}

// Find an account by normalized email without returning its password hash to a route handler.
export async function findUserByEmail(email: string) {
  const { users } = await getAuthCollections();
  const user = await users.findOne({ email });
  return user ? toAuthenticatedUser(user) : null;
}

// Authenticate a verified user without leaking whether the email address exists.
export async function authenticateUser(email: string, password: string) {
  const { users } = await getAuthCollections();
  const user = await users.findOne({ email });
  if (!user || !(await verifyPassword(password, user.passwordHash))) return { state: "invalid" as const };
  if (!user.emailVerifiedAt) return { state: "unverified" as const, user: toAuthenticatedUser(user) };
  return { state: "authenticated" as const, user: toAuthenticatedUser(user) };
}

// Issue an opaque session token and persist only its digest; token expiry is enforced in both code and MongoDB TTL indexes.
export async function createSession(userId: string) {
  const { sessions } = await getAuthCollections();
  const token = createOpaqueToken();
  const now = new Date();
  await sessions.insertOne({
    _id: randomUUID(),
    userId,
    tokenHash: hashOpaqueToken(token),
    createdAt: now,
    expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30),
  });
  return token;
}

// Resolve a live session into its user record, treating expired and orphaned sessions as signed out.
export async function getUserFromSessionToken(token: string) {
  const { sessions, users } = await getAuthCollections();
  const now = new Date();
  const session = await sessions.findOne({ tokenHash: hashOpaqueToken(token), expiresAt: { $gt: now } });
  if (!session) return null;

  const user = await users.findOne({ _id: session.userId });
  return user ? toAuthenticatedUser(user) : null;
}

// Invalidate one browser session during logout without trusting a client-supplied user identifier.
export async function deleteSessionByToken(token: string) {
  const { sessions } = await getAuthCollections();
  await sessions.deleteOne({ tokenHash: hashOpaqueToken(token) });
}

// Generate a one-use email token and invalidate previous links of the same kind for that user.
export async function createAuthToken(userId: string, kind: AuthTokenKind) {
  const { tokens } = await getAuthCollections();
  const token = createOpaqueToken();
  const now = new Date();
  const durationMs = kind === "email-verification" ? 1000 * 60 * 60 * 24 : 1000 * 60 * 60;

  await tokens.deleteMany({ userId, kind, usedAt: { $exists: false } });
  await tokens.insertOne({
    _id: randomUUID(),
    userId,
    kind,
    tokenHash: hashOpaqueToken(token),
    createdAt: now,
    expiresAt: new Date(now.getTime() + durationMs),
  });
  return token;
}

// Consume an email-verification token once while keeping every customer account in the customer role.
export async function verifyEmailToken(token: string) {
  const { tokens, users } = await getAuthCollections();
  const now = new Date();
  const tokenDocument = await tokens.findOneAndUpdate(
    { kind: "email-verification", tokenHash: hashOpaqueToken(token), expiresAt: { $gt: now }, usedAt: { $exists: false } },
    { $set: { usedAt: now } },
    { returnDocument: "after" },
  );
  if (!tokenDocument) return null;

  const user = await users.findOne({ _id: tokenDocument.userId });
  if (!user) return null;

  await users.updateOne({ _id: user._id }, { $set: { emailVerifiedAt: now, role: "customer", updatedAt: now } });
  return { ...toAuthenticatedUser(user), role: "customer" as const, emailVerifiedAt: now.toISOString() };
}

// Replace a password after atomically consuming its short-lived reset link, then revoke every prior session.
export async function resetPasswordWithToken(token: string, password: string) {
  const { sessions, tokens, users } = await getAuthCollections();
  const now = new Date();
  const tokenDocument = await tokens.findOneAndUpdate(
    { kind: "password-reset", tokenHash: hashOpaqueToken(token), expiresAt: { $gt: now }, usedAt: { $exists: false } },
    { $set: { usedAt: now } },
    { returnDocument: "after" },
  );
  if (!tokenDocument) return false;

  const result = await users.updateOne(
    { _id: tokenDocument.userId },
    { $set: { passwordHash: await hashPassword(password), updatedAt: now } },
  );
  if (!result.matchedCount) return false;

  await sessions.deleteMany({ userId: tokenDocument.userId });
  return true;
}
