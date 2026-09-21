import "server-only";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { getRepository, type OtpPurpose } from "@/lib/db";

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

const hash = (email: string, purpose: OtpPurpose, code: string) =>
  createHash("sha256").update(`${email}:${purpose}:${code}:${process.env.SESSION_SECRET || "elite-tax-dev-secret"}`).digest("hex");

/** Creates and stores a new 6-digit code. Returns { code } or { retryAfter } if asked again too soon. */
export async function issueOtp(email: string, purpose: OtpPurpose, payload: Record<string, unknown> | null = null) {
  const repo = getRepository();
  const existing = await repo.getOtp(email, purpose);
  if (existing) {
    const age = Date.now() - Date.parse(existing.createdAt);
    if (age < OTP_RESEND_COOLDOWN_MS) return { retryAfter: Math.ceil((OTP_RESEND_COOLDOWN_MS - age) / 1000) } as const;
  }
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const now = Date.now();
  await repo.saveOtp({
    email,
    purpose,
    codeHash: hash(email, purpose, code),
    attempts: 0,
    payload,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + OTP_TTL_MS).toISOString(),
  });
  return { code } as const;
}

export type OtpCheck =
  | { ok: true; payload: Record<string, unknown> | null }
  | { ok: false; error: string; status: number };

export async function checkOtp(email: string, purpose: OtpPurpose, code: string): Promise<OtpCheck> {
  const repo = getRepository();
  const otp = await repo.getOtp(email, purpose);
  if (!otp) return { ok: false, status: 400, error: "No active code for this email. Please request a new one." };
  if (Date.parse(otp.expiresAt) < Date.now()) {
    await repo.deleteOtp(email, purpose);
    return { ok: false, status: 400, error: "This code has expired. Please request a new one." };
  }
  if (otp.attempts >= OTP_MAX_ATTEMPTS) {
    await repo.deleteOtp(email, purpose);
    return { ok: false, status: 429, error: "Too many incorrect attempts. Please request a new code." };
  }
  const a = Buffer.from(hash(email, purpose, code));
  const b = Buffer.from(otp.codeHash);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    await repo.incrementOtpAttempts(email, purpose);
    const left = OTP_MAX_ATTEMPTS - otp.attempts - 1;
    return { ok: false, status: 400, error: left > 0 ? `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} left.` : "Too many incorrect attempts. Please request a new code." };
  }
  await repo.deleteOtp(email, purpose);
  return { ok: true, payload: otp.payload };
}
