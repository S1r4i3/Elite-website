import { PageHero } from "@/components/sections/page-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Terms & Conditions", description: "Terms & Conditions — Elite B Tax Services.", path: "/terms" });

export default function Page() {
  return <PageHero title="Terms & Conditions" crumbs={[{ label: "Terms & Conditions", href: "/terms" }]} primary={null} secondary={null} showCallLine={false} />;
}
