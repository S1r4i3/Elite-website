import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return <AuthShell mode="forgot" />;
}
