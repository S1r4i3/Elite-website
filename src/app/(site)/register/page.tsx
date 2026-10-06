import { privatePageMetadata } from "@/lib/seo";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = privatePageMetadata({
  title: "Create account",
  description: "Create your Elite B Tax Services client account to file securely online with a dedicated tax professional.",
  path: "/register",
});

export default function RegisterPage() {
  return <AuthShell mode="register" />;
}
