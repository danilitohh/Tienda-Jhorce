export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

// Keep every API response predictable for the frontend and future mobile clients.
export function ok<T>(data: T) {
  return { data, error: null };
}

// Normalize expected validation and domain errors without exposing sensitive internals.
export function fail(error: ApiError) {
  return { data: null, error };
}

