import { PageHero } from "@/components/sections/page-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Privacy Policy", description: "Privacy Policy — Elite B Tax Services.", path: "/privacy" });

export default function Page() {
  return <PageHero title="Privacy Policy" crumbs={[{ label: "Privacy Policy", href: "/privacy" }]} primary={null} secondary={null} showCallLine={false} />;
}
