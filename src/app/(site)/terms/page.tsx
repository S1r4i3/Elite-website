import { PageHero } from "@/components/sections/page-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Terms & Conditions", description: "The terms that apply when you use the Elite B Tax Services website, client portal and tax preparation services.", path: "/terms" });

export default function Page() {
  return <PageHero title="Terms & Conditions" crumbs={[{ label: "Terms & Conditions", href: "/terms" }]} primary={null} secondary={null} showCallLine={false} />;
}
