import { getSiteUrlString } from "@/lib/site-url";

type EmailMessage = Readonly<{ to: string; subject: string; html: string }>;

// Escape trusted template interpolations before rendering transactional email HTML.
function escapeHtml(value: string) {
  return value.replace(/[&<>'\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[character] ?? character);
}

// Deliver an email through Resend's HTTPS API without bringing a mail SDK into the storefront bundle.
async function deliverEmail(message: EmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return "not-configured" as const;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, ...message }),
      cache: "no-store",
    });
    return response.ok ? "sent" as const : "failed" as const;
  } catch {
    return "failed" as const;
  }
}

// Send a short-lived confirmation link after the store creates a pending customer account.
export function sendVerificationEmail(input: Readonly<{ email: string; firstName: string; token: string }>) {
  const link = `${getSiteUrlString()}/verificar-correo?token=${encodeURIComponent(input.token)}`;
  return deliverEmail({
    to: input.email,
    subject: "Confirma tu cuenta byjhor",
    html: `<p>Hola, ${escapeHtml(input.firstName)}.</p><p>Confirma tu cuenta byjhor para activar tu acceso:</p><p><a href="${link}">Confirmar mi cuenta</a></p><p>Este enlace vence en 24 horas.</p>`,
  });
}

// Send a one-use reset link without exposing whether a given customer email exists.
export function sendPasswordResetEmail(input: Readonly<{ email: string; firstName: string; token: string }>) {
  const link = `${getSiteUrlString()}/restablecer-contrasena?token=${encodeURIComponent(input.token)}`;
  return deliverEmail({
    to: input.email,
    subject: "Restablece tu contraseña byjhor",
    html: `<p>Hola, ${escapeHtml(input.firstName)}.</p><p>Usa este enlace para crear una nueva contraseña:</p><p><a href="${link}">Restablecer contraseña</a></p><p>Este enlace vence en una hora. Si no lo solicitaste, puedes ignorar este correo.</p>`,
  });
}
