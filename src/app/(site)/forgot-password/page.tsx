import { privatePageMetadata } from "@/lib/seo";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = privatePageMetadata({
  title: "Forgot password",
  description: "Reset the password for your Elite Tax Services client portal account.",
  path: "/forgot-password",
});

export default function ForgotPasswordPage() {
  return <AuthShell mode="forgot" />;
}
