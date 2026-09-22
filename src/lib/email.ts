import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/lib/site";

let transporter: Transporter | null | undefined;

/** SMTP transport from env. Returns null when email isn't configured. */
function getTransporter() {
  if (transporter !== undefined) return transporter;
  const host = process.env.SMTP_HOST;
  if (!host || !emailConfigured()) return (transporter = null);
  const port = Number(process.env.SMTP_PORT || 587);
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transporter;
}

/** True when SMTP is set up (a host, plus a password whenever a username is given). */
export const emailConfigured = () => Boolean(process.env.SMTP_HOST && (!process.env.SMTP_USER || process.env.SMTP_PASS));

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const layout = (inner: string) => `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#17212b">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e8ee">
      <tr><td style="background:#1b1f24;padding:20px 28px;color:#ffffff;font-weight:800;letter-spacing:2px;font-size:16px">ELITE <span style="color:#ff6b78">B</span> TAX</td></tr>
      <tr><td style="padding:32px 28px">${inner}</td></tr>
      <tr><td style="padding:16px 28px;border-top:1px solid #e4e8ee;font-size:12px;color:#66727f">${esc(site.name)} · ${esc(site.address.display)} · ${esc(site.phone.display)} · ${esc(site.email)}</td></tr>
    </table>
  </td></tr></table></body></html>`;

/** Account verification email with a "Verify Email Address" button. */
export async function sendVerificationEmail(to: string, link: string, name?: string) {
  const t = getTransporter();
  if (!t) throw new Error("EMAIL_NOT_CONFIGURED");
  const html = layout(`
        <h1 style="margin:0 0 16px;font-size:22px;color:#17212b">Verify your email address</h1>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.6">${name ? `Hi ${esc(name)},` : "Hi,"}</p>
        <p style="margin:0 0 26px;font-size:15px;line-height:1.6">Thanks for creating an account with ${esc(site.name)}. Please click the button below to verify your email address and activate your account.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 26px"><tr><td style="border-radius:10px;background:#c8102e">
          <a href="${esc(link)}" target="_blank" style="display:inline-block;padding:15px 34px;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px">Verify Email Address</a>
        </td></tr></table>
        <p style="margin:0 0 8px;font-size:13px;color:#52606d;line-height:1.6"><em>This link expires in 24 hours. If you did not create an account, no further action is required.</em></p>
        <p style="margin:18px 0 0;font-size:12px;color:#66727f;line-height:1.6;word-break:break-all">If the button doesn't work, copy and paste this link into your browser:<br><a href="${esc(link)}" style="color:#c8102e">${esc(link)}</a></p>`);
  await t.sendMail({
    from: process.env.EMAIL_FROM || `"${site.name}" <${process.env.SMTP_USER || site.email}>`,
    to,
    subject: `Verify your email address — ${site.name}`,
    text: `${name ? `Hi ${name},\n\n` : ""}Please verify your email address to activate your ${site.name} account:\n\n${link}\n\nThis link expires in 24 hours. If you did not create an account, no further action is required.`,
    html,
  });
}

export async function sendOtpEmail(to: string, code: string, purpose: "login" | "register" | "reset", name?: string) {
  const t = getTransporter();
  if (!t) throw new Error("EMAIL_NOT_CONFIGURED");
  const action =
    purpose === "register" ? "verify your email and finish creating your account" : purpose === "reset" ? "reset your password" : "sign in to your account";
  const greeting = name ? `Hi ${esc(name)},` : "Hi,";
  const html = `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#17212b">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e8ee">
      <tr><td style="background:#1b1f24;padding:20px 28px;color:#ffffff;font-weight:800;letter-spacing:2px;font-size:16px">ELITE <span style="color:#ff6b78">B</span> TAX</td></tr>
      <tr><td style="padding:28px">
        <p style="margin:0 0 12px;font-size:15px">${greeting}</p>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.5">Use this code to ${action}:</p>
        <div style="font-size:34px;font-weight:800;letter-spacing:10px;text-align:center;background:#fef2f3;color:#c8102e;border-radius:12px;padding:18px 0">${code}</div>
        <p style="margin:20px 0 0;font-size:13px;color:#52606d;line-height:1.5">This code expires in 10 minutes. If you didn't request it, you can safely ignore this email.</p>
      </td></tr>
      <tr><td style="padding:16px 28px;border-top:1px solid #e4e8ee;font-size:12px;color:#66727f">${esc(site.name)} · ${esc(site.address.display)} · ${esc(site.phone.display)}</td></tr>
    </table>
  </td></tr></table></body></html>`;
  await t.sendMail({
    from: process.env.EMAIL_FROM || `"${site.name}" <${process.env.SMTP_USER || site.email}>`,
    to,
    subject: `${code} is your ${site.shortName} verification code`,
    text: `${name ? `Hi ${name},\n\n` : ""}Your ${site.name} verification code is ${code}. It expires in 10 minutes.\n\nIf you didn't request this, ignore this email.`,
    html,
  });
}
