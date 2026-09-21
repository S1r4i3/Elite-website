import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/lib/site";

let transporter: Transporter | null | undefined;

/** SMTP transport from env. Returns null when email isn't configured. */
function getTransporter() {
  if (transporter !== undefined) return transporter;
  const host = process.env.SMTP_HOST;
  if (!host) return (transporter = null);
  const port = Number(process.env.SMTP_PORT || 587);
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transporter;
}

export const emailConfigured = () => Boolean(process.env.SMTP_HOST);

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendOtpEmail(to: string, code: string, purpose: "login" | "register", name?: string) {
  const t = getTransporter();
  if (!t) throw new Error("EMAIL_NOT_CONFIGURED");
  const action = purpose === "register" ? "verify your email and finish creating your account" : "sign in to your account";
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
