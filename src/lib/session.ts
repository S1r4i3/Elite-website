/**
 * Customer session tokens: `<customerId>.<expiresAtMs>.<hmac>` signed with SESSION_SECRET.
 * Uses Web Crypto so it works in middleware (Edge) and route handlers (Node).
 */
export const SESSION_COOKIE = "elite_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const enc = new TextEncoder();

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s && process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET must be set in production");
  return s || "elite-tax-dev-secret";
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(customerId: string) {
  const payload = `${customerId}.${Date.now() + SESSION_MAX_AGE * 1000}`;
  return `${payload}.${await hmac(`customer:${payload}`)}`;
}

/** Returns the customer id for a valid, unexpired token, otherwise null. */
export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts;
  if (!id || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return null;
  const expected = await hmac(`customer:${id}.${exp}`);
  return safeEqual(sig, expected) ? id : null;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
