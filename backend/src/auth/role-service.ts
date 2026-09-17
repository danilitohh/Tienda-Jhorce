import type { StoreRole } from "@backend/auth/auth-types";

// The optional Vercel secret names the single verified owner without exposing an elevation route to clients.
export function getRoleForVerifiedEmail(email: string): StoreRole {
  const ownerEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return ownerEmail && ownerEmail === email ? "admin" : "customer";
}

// Keep the authorization check shared between the admin page and persistence layer.
export function isStoreAdmin(role: unknown): role is "admin" {
  return role === "admin";
}
