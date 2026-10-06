import { PageHero } from "@/components/sections/page-hero";
import { Reviews } from "@/components/sections/reviews";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Client Reviews",
  description: "Verified reviews from Elite B Tax Services clients for tax preparation, FBAR/FATCA, ITIN, business and NRI tax services.",
  path: "/reviews",
});

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="What clients say about working with us."
        subtitle="We only publish reviews we can link back to their original source."
        crumbs={[{ label: "Reviews", href: "/reviews" }]}
      />
      <Reviews limit={60} />
      <FinalCta />
    </>
  );
}
