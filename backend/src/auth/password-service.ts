import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const DERIVED_KEY_LENGTH = 64;

// Hash passwords with a unique salt; only the encoded result is persisted in MongoDB.
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const derivedKey = await scryptAsync(password, salt, DERIVED_KEY_LENGTH) as Buffer;
  return `scrypt$${salt}$${derivedKey.toString("base64url")}`;
}

// Compare a submitted password in constant time, returning false for malformed legacy values.
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, salt, encodedKey] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !encodedKey) return false;

  try {
    const expectedKey = Buffer.from(encodedKey, "base64url");
    const derivedKey = await scryptAsync(password, salt, expectedKey.length) as Buffer;
    return expectedKey.length === derivedKey.length && timingSafeEqual(expectedKey, derivedKey);
  } catch {
    return false;
  }
}
