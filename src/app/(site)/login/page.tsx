import { privatePageMetadata } from "@/lib/seo";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = privatePageMetadata({
  title: "Log in",
  description: "Sign in to your Elite Tax Services client portal to upload documents, review draft estimations and download your final return.",
  path: "/login",
});

export default function LoginPage() {
  return <AuthShell mode="login" />;
}
