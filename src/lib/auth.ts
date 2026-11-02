/** Minimal admin session helpers (Edge + Node compatible via Web Crypto). */
export const ADMIN_COOKIE = "elite_admin";

async function sha256(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedAdminToken() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  // Never sign admin cookies with a publicly known fallback in production.
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") return null;
    return sha256(`${pw}:elite-tax-dev-secret`);
  }
  return sha256(`${pw}:${secret}`);
}

export async function isValidAdminToken(token: string | undefined) {
  if (!token) return false;
  const expected = await expectedAdminToken();
  if (!expected || token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

