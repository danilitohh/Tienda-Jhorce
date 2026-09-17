// Domain roles stay intentionally small: customers use the storefront and the owner manages it.
export type StoreRole = "customer" | "admin";

// Only serializable, non-sensitive user fields may cross from the server to the browser.
export type AuthenticatedUser = Readonly<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: StoreRole;
  emailVerifiedAt: string | null;
}>;

// Auth endpoints return a stable error vocabulary without exposing internal persistence details.
export type AuthErrorCode =
  | "AUTH_NOT_CONFIGURED"
  | "INVALID_INPUT"
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_VERIFIED"
  | "INVALID_OR_EXPIRED_TOKEN"
  | "EMAIL_DELIVERY_UNAVAILABLE"
  | "RATE_LIMITED"
  | "AUTH_UNAVAILABLE";
