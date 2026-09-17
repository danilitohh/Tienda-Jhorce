import { z } from "zod";

// Normalize emails at the boundary so MongoDB's unique index and every lookup share one identity format.
const normalizedEmail = z.string().trim().email().max(320).transform((value) => value.toLowerCase());

// Keep password rules server-owned; clients may mirror them only for immediate feedback.
const password = z.string().min(8).max(128);

// Validate customer registration before any password hash or database write is attempted.
export const signUpSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: normalizedEmail,
  password,
});

// Validate sign-in credentials without revealing which field failed to a caller.
export const loginSchema = z.object({
  email: normalizedEmail,
  password: z.string().min(1).max(128),
});

// Password-recovery requests only need a valid normalized email address.
export const recoveryRequestSchema = z.object({ email: normalizedEmail });

// Reset and verification links use opaque URL-safe tokens generated only on the server.
const opaqueToken = z.string().regex(/^[A-Za-z0-9_-]{40,200}$/);

// Verify a reset request before it can replace a password or revoke active sessions.
export const passwordResetSchema = z.object({ token: opaqueToken, password });

// Verify the same token format when an account owner confirms their email address.
export const emailVerificationSchema = z.object({ token: opaqueToken });
