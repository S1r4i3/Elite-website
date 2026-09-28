import { PageHero } from "@/components/sections/page-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Privacy Policy", description: "How Elite B Tax Services collects, uses and protects your personal information and tax documents when you use our website and client portal.", path: "/privacy" });

export default function Page() {
  return <PageHero title="Privacy Policy" crumbs={[{ label: "Privacy Policy", href: "/privacy" }]} primary={null} secondary={null} showCallLine={false} />;
}
