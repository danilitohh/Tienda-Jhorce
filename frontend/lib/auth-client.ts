type ApiFailure = Readonly<{ data: null; error: Readonly<{ code: string; message: string }> }>;
type ApiSuccess<T> = Readonly<{ data: T; error: null }>;

// Submit same-origin auth requests with one predictable response shape for every account form.
export async function postAuth<T>(path: string, payload: unknown): Promise<ApiSuccess<T> | ApiFailure> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    return await response.json() as ApiSuccess<T> | ApiFailure;
  } catch {
    return { data: null, error: { code: "NETWORK_ERROR", message: "No pudimos conectar con el servicio. Inténtalo de nuevo." } };
  }
}

// Read the current account projection without ever exposing the HttpOnly session token to JavaScript.
export async function getClientSession() {
  try {
    const response = await fetch("/api/auth/session", { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json() as ApiSuccess<{ user: { firstName: string } | null }>;
    return payload.data.user;
  } catch {
    return null;
  }
}
